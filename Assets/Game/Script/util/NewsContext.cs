using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assets.Game.Script.util
{
    class NewsContext<T>
    {
        public int state = 0;
        public string msg = null;
        public T data;
    }
}
