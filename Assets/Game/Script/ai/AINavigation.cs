using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class AINavigation : MonoBehaviour
{
    [Header("目标物体")]
    public GameObject target;
    private NavMeshAgent agent;

    // Start is called before the first frame update
    void Start()
    {
        agent = GetComponent<NavMeshAgent>();
    }

    //移动
    public void AiWalk(Vector3 position)
    {
        agent.destination = position;
    }

    //跟随目标
    public void AiFollowTarget()
    {
        agent.destination = this.target.transform.position;
    }

    // Update is called once per frame
    void Update()
    {
        
    }

}
