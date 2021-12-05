using Assets.Game.Script.NGame.protobuf;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;
using System;
using System.Collections.Generic;
using System.Reflection;
using UnityEngine;

/**
 * NGame 增强器 用于 增强 RPC 对象
 * 
 * 因为unity 不支持 EMIT (AOP) 所以采用继承方式
 * 
 */


namespace Assets.Game.plugs.NGame.tools
{
    public class NGameRPCIntensifier
    {

        public NGameApplication nGame;

        /// <summary>
        /// 通过增强器去调用方法
        /// </summary>
        public void run(String action, object[] args)
        {

            MethodInfo method = this.GetType().GetMethod(action);

            //判断是否有NGameRPCMethod注解
            if (method == null || method.GetCustomAttribute(typeof(NGameRPCMethod)) == null)
            {
                return;
            }

            Any message = null;
            NGameMessage nMessage = null;
            NUIDMode nUIDMode = null;

            //判断是否有NUIDMode
            if ((nUIDMode = method.GetCustomAttribute(typeof(NUIDMode)) as NUIDMode) != null)
            {
                nMessage = new NGameMessage()
                {
                    Uid = nUIDMode.uuid
                };
            }
            else
            {
                nMessage = new NGameMessage()
                {
                    Action = this.GetType().Name,
                    Event = method.Name,
                };
            }


            foreach (object v in args)
            {

                if (typeof(IMessage).IsAssignableFrom(v.GetType()))
                {
                    message = Any.Pack(v as IMessage);
                }

            }

            nMessage.Message = message;

            this.nGame.SendQueue(nMessage.ToByteArray());
            Debug.Log(string.Format("拦截器开始调用方法，类名: {0} 方法名是：{1}。", this.GetType().Name, method.Name));
            method.Invoke(this, args);//此处会调用真正的方法 invocation.Proceed();


        }
    }
}
