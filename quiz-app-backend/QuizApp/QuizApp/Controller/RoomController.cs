using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using QuizApp.Extension;
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
        private readonly IFieldLogic fieldLogic;
        private static ICollection<IDisposable> quizCardUpdateList = new List<IDisposable>();

        public RoomController(IFieldLogic fieldLogic)
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
                quizCardUpdateList.Add(fieldLogic.OnQuizCardUpdate().Subscribe(x =>
                {
                    BackgroundSocketProcessor.AddNewStateChangeToQueue(x);
                }));
                await HandleStateChangeWebSocket(HttpContext, webSocket);
            }
            else
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
        }

        //TODO: This should be its own document
        //Setup for state change:
        //Beginning with higest:
        //32 Bit Topic ID
        //32 Bit Card ID

        private async Task HandleStateChangeWebSocket(HttpContext context, WebSocket webSocket)
        {
            var socketFinishedTcs = new TaskCompletionSource<object>();

            BackgroundSocketProcessor.AddSocket(webSocket, socketFinishedTcs);

            //     await socketFinishedTcs.Task;
            var buffer = new byte[8];
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            while (!result.CloseStatus.HasValue)
            {
                var fullBuffer = buffer.Take(result.Count);
                while (!result.EndOfMessage)
                {
                    result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    fullBuffer = fullBuffer.Concat(buffer.Take(result.Count));
                }
                var cardId = BitConverter.ToInt32(fullBuffer.TakeLast(4).ToArray());
                var topicId = BitConverter.ToInt32(fullBuffer.SkipLast(4).ToArray());
                fieldLogic.ChangeStateOfQuizCardToNext(topicId, cardId);
                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }
            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
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