using BehaviorDesigner.Runtime.Tasks;
using UnityEngine;

public class AIAction : Action
{

    public AINavigation Ai;

    public override void OnStart()
    {
        this.Ai = this.gameObject.GetComponent<AINavigation>();
    }

    public override TaskStatus OnUpdate()
    {
        Debug.Log("AIAction - OnUpdate");
        //¸úËæÄ¿±ê
        this.Ai.AiFollowTarget();
        return TaskStatus.Success;
    }

}
