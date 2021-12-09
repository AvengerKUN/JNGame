using Google.Protobuf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assets.Game.plugs.NGame.verify.tools
{

    /// <summary>
    /// 验证组 用于 多验证时候的统一处理
    /// </summary>

    class ActionVerifyGroup : ActionSyncVerifyInter
    {

        public List<ActionSyncVerifyInter> verifys = new List<ActionSyncVerifyInter>();

        public override IMessage ToIMessage()
        {
            return null;
        }

        public override bool Verify()
        {

            bool isModify = false;

            verifys.ForEach(verify =>{

                if (verify.Verify()) isModify = true;

            });

            return isModify;

        }
    }
}
