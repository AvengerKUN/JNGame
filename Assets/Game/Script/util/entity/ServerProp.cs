

using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

namespace Assets.Game.Script.util.entity
{
    /// <summary>
    /// 服务器Object 枚举
    /// </summary>
    public enum ServerPropEnum
    {
        None, //无
        GamePlayer, //玩家
    }

    /// <summary>
    /// 用于查找物品信息
    /// </summary>
    public class ServerPropQuery
    {
        //预制体组
        public static Dictionary<int, GameObject> itemPrefar = new Dictionary<int, GameObject>() {
            { (int)ServerPropEnum.GamePlayer,Resources.Load<GameObject>("/Prefab/GamePlayer.prefab") }
        };

        /// <summary>
        /// 查找预制体
        /// </summary>
        /// <returns></returns>
        public static GameObject QueryPrefar(ServerPropEnum prop)
        {
            return itemPrefar[(int)prop];
        }

    }
}
