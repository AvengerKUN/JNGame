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

        private void Update()
        {
            while (queue.Count != 0)
            {
                queue.Dequeue()();
            }
        }

        public static void Task(Action action)
        {
            queue.Enqueue(action);
        }

    }
}
