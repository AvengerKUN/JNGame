using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Game.Script.plugs
{
    class UnityTask : MonoBehaviour
    {

        public static Queue<Action> queue = new Queue<Action>();

        public static Dictionary<string,Action> onlyQueue = new Dictionary<string, Action>();

        private void Update()
        {
            while (queue.Count != 0)
            {
                queue.Dequeue()();
            }
            foreach(Action action in onlyQueue.Values)
            {
                action();
            }
        }

        public static void NextTask(Action action)
        {
            queue.Enqueue(action);
        }

        public static void Task(string key,Action action)
        {
            onlyQueue.Add(key,action);
        }

    }
}
