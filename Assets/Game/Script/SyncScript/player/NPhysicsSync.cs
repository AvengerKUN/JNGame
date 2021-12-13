using Assets.Game.Script.plugs;
using UnityEngine;

namespace Assets.Game.Script.SyncScript.player
{

    //带同步的物理 类

    public class NPhysicsSync : NPlayerSync
    {

        private Rigidbody rigidbody;
        private bool lastActorControl = true;

        [Header("控制物理的对象")]
        public GameObject physics;


        public override void GStart()
        {
            if (physics != null)
            {
                this.rigidbody = physics.GetComponent<Rigidbody>();
            }
            base.GStart();
        }

        public override void GUpdate()
        {


            if (physics != null)
            {
                if (this.isActorControl() != lastActorControl)
                {
                    lastActorControl = this.isActorControl();

                    if (lastActorControl) {

                    }
                    else
                    {
                        physics.SetActive(false);
                    }

                }
            }

            if (lastActorControl) {
                //更新物理位置
                this.transform.position = this.physics.transform.position;
                this.transform.rotation = this.physics.transform.rotation;
            }

            base.GUpdate();
        }

        public void OnCollisionEnter(Collision collision)
        {

            //如果这个Actor本机没有权限则通过传递方式获取权限 ( 我碰到不属于我的Actor 获取 Actor 占为己有 在触发物理效果 )

            if (this.isActorControl()) return;

            //获取同步类 如果触碰者不属于同步类下面的则不执行 并且 同步类的权限属于本机
            ActorSync actorSync = null;
            if (((actorSync = collision.collider.GetComponent<ActorSync>()) == null) || !actorSync.isActorControl()) return;

            Debug.Log("GetForceActorOwner");

            //调用强制获取权限 将Actor占为己有
            this.GetForceActorOwner();
        }



    }
}
