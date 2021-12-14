using Assets.Game.Script.plugs;
using System.Threading;
using UnityEngine;

namespace Assets.Game.Script.SyncScript.player
{

    //带同步的物理 类

    public class NPhysicsSync : NPlayerSync
    {

        private Rigidbody rigidbody;
        private bool isControl;

        public override void GStart()
        {

            this.rigidbody = this.GetComponent<Rigidbody>();

            //rigidbody.isKinematic = true;

            //Timer timer = new Timer(new TimerCallback((o) => {
            //    UnityTask.NextTask(() => {
            //        rigidbody.isKinematic = false;
            //    });
            //}), this, 0, 2000);

            base.GStart();
        }

        public override void GUpdate()
        {


            if (rigidbody != null)
            {
                rigidbody.isKinematic = !this.isActorControl();
                //if (rigidbody.isKinematic)
                //{
                //    transform.Translate(new Vector3() { x = 0.001f, y = 0, z = 0 });
                //}
            }
            //if (rigidbody != null)
            //{
            //    rigidbody.isKinematic = !isControl;
            //    if (rigidbody.isKinematic) {
            //        transform.Translate(new Vector3() { x=0.001f,y=0,z=0});
            //    }
            //}

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

            //isControl = true;

        }



    }
}
