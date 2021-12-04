using Assets.Game.Script.NGame.protobuf;
using Castle.DynamicProxy;
using DotNetty.Buffers;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;
using System.Reflection;
using UnityEngine;

/**
 * NGame 增强器 用于 增强 RPC 对象
 */

namespace Assets.Game.plugs.NGame.tools
{
    class NGameRPCIntensifier : StandardInterceptor
    {
        private NGameApplication nGame;

        public NGameRPCIntensifier(NGameApplication nGame)
        {
            this.nGame = nGame;
        }

        //protected override void PreProceed(IInvocation invocation)
        //{
        //    Debug.Log(string.Format("拦截器调用方法前，方法名是：{0}。", invocation.Method.Name));
        //}

        protected override void PerformProceed(IInvocation invocation)
        {

            //判断是否有NGameRPCMethod注解
            if (invocation.Method.GetCustomAttribute(typeof(NGameRPCMethod)) == null){
                base.PerformProceed(invocation);
                return;
            }

            Any message = null;
            NGameMessage nMessage = null;
            NUIDMode nUIDMode = null;
            //判断是否有NUIDMode
            if ((nUIDMode = invocation.Method.GetCustomAttribute(typeof(NUIDMode)) as NUIDMode) != null)
            {
                nMessage = new NGameMessage() {
                    Uid = nUIDMode.uuid
                };
            }
            else
            {
                nMessage = new NGameMessage() {
                    Action = invocation.InvocationTarget.GetType().BaseType.Name,
                    Event = invocation.Method.Name,
                };
            }


            foreach (object v in invocation.Arguments)
            {

                if (typeof(IMessage).IsAssignableFrom(v.GetType()))
                {
                    message = Any.Pack(v as IMessage);
                }

            }

            nMessage.Message = message;

            this.nGame.SendQueue(Unpooled.WrappedBuffer(nMessage.ToByteArray()));
            Debug.Log(string.Format("拦截器开始调用方法，类名: {0} 方法名是：{1}。", invocation.InvocationTarget.GetType().BaseType.Name, invocation.Method.Name));
            base.PerformProceed(invocation);//此处会调用真正的方法 invocation.Proceed();
        }

        //protected override void PostProceed(IInvocation invocation)
        //{
        //    Debug.Log(string.Format("拦截器调用方法后，方法名是：{0}。", invocation.Method.Name));
        //}
    }
}
