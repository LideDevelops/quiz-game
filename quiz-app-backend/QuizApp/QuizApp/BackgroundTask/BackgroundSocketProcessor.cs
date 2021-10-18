using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using QuizApp.Extension;
using QuizApp.Logic;

namespace QuizApp
{
    internal class BackgroundSocketProcessor : IHostedService, IDisposable
    {
        private Timer _timer;
        private static ConcurrentBag<(WebSocket socket, TaskCompletionSource<object> socketFinishedTcs)> webSockets = new ConcurrentBag<(WebSocket socket, TaskCompletionSource<object> socketFinishedTcs)>();
        private static ConcurrentQueue<Tuple<int, int, QuizCardState>> newStateQueue = new ConcurrentQueue<Tuple<int, int, QuizCardState>>();
        private static ConcurrentBag<Task> receiveTasks = new ConcurrentBag<Task>();
        private readonly IFieldLogic fieldLogic;

        public BackgroundSocketProcessor(IFieldLogic fieldLogic)
        {
            this.fieldLogic = fieldLogic;
        }

        public void Dispose()
        {
            _timer.Dispose();
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(HandleSockets, null, TimeSpan.Zero,
                TimeSpan.FromMilliseconds(5));

            return Task.CompletedTask;
        }

        private void HandleSockets(object state)
        {
            var sendingTask = Task.Factory.StartNew(async () =>
            {
                while (newStateQueue.TryDequeue(out Tuple<int, int, QuizCardState> nextStateToSend))
                {
                    foreach (var socket in webSockets)
                    {
                        await socket.socket.SendFieldStateChangeAsync(nextStateToSend);
                    }
                }
            });
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public static void AddSocket(WebSocket webSocket, TaskCompletionSource<object> socketFinishedTcs)
        {
            webSockets.Add((socket: webSocket, socketFinishedTcs));
        }

        public static void AddNewStateChangeToQueue(Tuple<int, int, QuizCardState> newStateChangeCall)
        {
            newStateQueue.Enqueue(newStateChangeCall);
        }
    }
}