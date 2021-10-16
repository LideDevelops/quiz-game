using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace QuizApp.Extension
{
    public static class WebSocketQuizFieldExtension
    {

        public static void SendFieldStateChange(this WebSocket socket, Tuple<int, int, QuizCardState> x)
        {
            var buffer = BitConverter.GetBytes(x.Item1).Concat(BitConverter.GetBytes(x.Item2)).Concat(BitConverter.GetBytes(((int)x.Item3)));
            var segment = new ArraySegment<byte>(buffer.ToArray());
            socket.SendAsync(segment, WebSocketMessageType.Binary, true, default).RunSynchronously();
        }
    }
}
