using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using QuizApp.Logic;
using QuizApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Reactive.Subjects;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace QuizApp.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class RoomController : ControllerBase
    {
        private static Subject<QuizFieldState> currentQuiz = new Subject<QuizFieldState>();
        private static ICollection<WebSocket> sockets = new List<WebSocket>();
        private readonly FieldLogic fieldLogic;

        public RoomController(FieldLogic fieldLogic)
        {
            this.fieldLogic = fieldLogic;
        }

        [HttpGet("state")]
        public async Task Get()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                WebSocket webSocket = await
                                   HttpContext.WebSockets.AcceptWebSocketAsync();
                currentQuiz.Subscribe(x => webSocket.SendAsync(new ArraySegment<byte>(JsonConvert.SerializeObject(x).Select(y => (byte)y).ToArray()), WebSocketMessageType.Text, true, default));
                sockets.Add(webSocket);
                await HandleWebSocket(HttpContext, webSocket);
            }
            else
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
        }

        private async Task HandleWebSocket(HttpContext context, WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            while (!result.CloseStatus.HasValue)
            {
                currentQuiz.OnNext(ParseWebSocketEntry(new string(buffer.Select(x => (char)x).ToArray())));

                await webSocket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);

                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }
            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            sockets.Remove(webSocket);
            webSocket.Dispose();
        }

        private QuizFieldState ParseWebSocketEntry(string json)
        {
            return JsonConvert.DeserializeObject<QuizFieldState>(json);
        }

        [HttpPost("setup")]
        public void SetupField([FromBody] IEnumerable<QuizFieldTopic> topics)
        {
            fieldLogic.SetupNewQuizField(topics);   
        }

        [HttpGet("currentField")]
        public IActionResult GetCurrentQuizField()
        {
            return Ok(fieldLogic.GetCurrentQuizField());
        }
    }
}