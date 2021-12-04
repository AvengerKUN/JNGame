using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Game.plugs.NGame.tools
{
    class AttributeUtil
    {

        public static Type[] GetAllSystemAttributeClass(Type attribute)
        {

            List<Type> types = new List<Type>();

            foreach (Type t in Assembly.GetExecutingAssembly().GetTypes())
            {
                Attribute attribute1 = t.GetCustomAttribute(attribute);

                if(attribute1 != null)
                {
                    types.Add(t);
                }
            }

            return types.ToArray();
        }

    }
}
