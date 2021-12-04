using DotNetty.Transport.Channels;
using DotNetty.Transport.Channels.Sockets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Game.Script.NGame.network.handler
{
    class InitNGameHandler : SimpleChannelInboundHandler<DatagramPacket>
    {
        /*
            统一接收请求
         */
        protected override void ChannelRead0(IChannelHandlerContext ctx, DatagramPacket msg)
        {
            //Debug.Log("123456");
        }
    }
}
