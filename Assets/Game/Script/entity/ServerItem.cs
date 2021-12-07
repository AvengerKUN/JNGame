using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Game.Script.entity
{
    /// <summary>
    /// 服务器物品
    /// </summary>
    public class ServerItem
    {

        public int itemId; //物品ID
        public GameObject prefab; //物品的prefab

        public ServerItem(int itemId, GameObject prefab)
        {
            this.itemId = itemId;
            this.prefab = prefab;
        }

        static ServerItem create(int itemId, GameObject prefab)
        {
            return new ServerItem(itemId, prefab);
        }

        public class Items
        {

            //用户角色
            static ServerItem UserRole = ServerItem.create(1,);

        }

    }
}
