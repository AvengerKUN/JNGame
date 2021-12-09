using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;

namespace Assets.Game.Script.util.api
{
    class ServeApi
    {

        //正式服务器根路径
        private static string baseUrl = "http://127.0.0.1:9190";

        public static string URL(string url)
        {
            return string.Format("{0}{1}", baseUrl, url);
        }

        public static IEnumerator Get(string url,Action<String> action)
        {
            UnityWebRequest request = UnityWebRequest.Get(URL(url));
            yield return request.SendWebRequest();
            action(request.downloadHandler.text);
        }

    }
}
