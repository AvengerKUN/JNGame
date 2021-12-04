using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RigidBodyController : MonoBehaviour
{
    public float speed = 10f;
    private Rigidbody body;
    public Camera camera;
    public float rotateSpeed = 5;

    // Start is called before the first frame update
    void Start()
    {
        this.body = GetComponent<Rigidbody>();
    }

    // Update is called once per frame
    void Update()
    {
        //ÒÆ¶¯
        this.MoveLikeWow();
    }
    void MoveLikeWow()
    {
        float hor = Input.GetAxis("Horizontal");
        float ver = Input.GetAxis("Vertical");

        if (hor == 0 && ver == 0)
        {
            return;
        };

        Vector3 dir = new Vector3(hor, 0f, ver);
        float y = this.camera.transform.rotation.eulerAngles.y;


        //body.AddForce(transform.forward);
        Vector3 dirPost = speed * (Quaternion.Euler(0, y, 0) * dir) * Time.deltaTime;
        //body.velocity = vector3;
        //body.MovePosition(transform.position + dirPost);
        this.transform.rotation = Quaternion.RotateTowards(transform.rotation, Quaternion.LookRotation(dirPost), rotateSpeed);

    }
}
