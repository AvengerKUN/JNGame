using UnityEngine;

namespace Assets.Game.Script.SyncScript.player
{

    //带同步的物理 类

    class NPhysicsSync : NPlayerSync
    {

        private Rigidbody rigidbody;


        public override void GStart()
        {
            this.rigidbody = this.GetComponent<Rigidbody>();
            base.GStart();
        }

        public override void GUpdate()
        {
            if (this.rigidbody)
            {
                //如果没有权限控制则取消物理
                if (this.isActorControl())
                {
                    //还原之前velocity
                    rigidbody.isKinematic = false;
                }
                else
                {
                    //取消物理
                    rigidbody.isKinematic = true;
                }
            }
            base.GUpdate();
        }

    }
}
