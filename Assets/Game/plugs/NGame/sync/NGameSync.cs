using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Game.plugs.NGame.sync
{
    /// <summary>
    /// 网络同步的基础Class
    /// </summary>
    public abstract class NGameSync : MonoBehaviour
    {
        //时间+
        private float checkTimeData = 0;
        //服务器帧时间
        public float timeServer = 1;

        public NGameApplication nGame;

        public void Start()
        {
            this.nGame.nNGameSyncs.Add(this);
            this.GStart();
        }

        public void Update()
        {

            this.GUpdate();

            float dt = Time.deltaTime;
            this.checkTimeData += dt;

            if (this.timeServer <= this.checkTimeData)
            {
                this.checkTimeData -= this.timeServer;
                //调用网络帧
                this.NTick();
            }

        }

        //网络帧
        public abstract void NTick();


        public abstract void GStart();
        public abstract void GUpdate();

    }
}
