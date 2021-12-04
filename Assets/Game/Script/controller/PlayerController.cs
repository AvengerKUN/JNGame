using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour
{

    public float Speed = 10;//每秒速度
    public Camera camera;
    private CharacterController controller;
    public float rotateSpeed = 5;
    public float gravity;
    private Vector3 velocity = Vector3.zero;
    private Vector3 lastPostiton = Vector3.zero;

    private float jumpSpeed = 10f;

    public Transform groundCheck;
    public float checkRadius;
    public LayerMask groundLayer;
    public bool isGround;



    // Start is called before the first frame update
    void Start()
    {
        this.controller = GetComponent<CharacterController>();
    }

    // Update is called once per frame
    void Update()
    {

        //移动
        this.MoveLikeWow ();
        //上下
        this.MoveFreeFall();
    }

    void MoveLikeWow()
    {


        float hor = Input.GetAxis("Horizontal");
        float ver = Input.GetAxis("Vertical");

        if (hor == 0 && ver == 0)
        {
            return;
        };

        Vector3 direction = new Vector3(hor, 0, ver);
        float y = camera.transform.rotation.eulerAngles.y;
        direction = Quaternion.Euler(0, y, 0) * direction;

        this.controller.Move(direction * Time.deltaTime * this.Speed);
        this.transform.rotation = Quaternion.RotateTowards(transform.rotation, Quaternion.LookRotation(direction), rotateSpeed);


    }
    void MoveFreeFall()
    {
        //velocity.y -= this.gravity * Time.deltaTime;
        //this.controller.Move(velocity * Time.deltaTime);

        //if (this.lastPostiton.y == this.transform.position.y) velocity = Vector3.zero;
        //else this.lastPostiton = this.transform.position;


        isGround = Physics.CheckSphere(groundCheck.position, checkRadius, groundLayer);

        if(isGround && velocity.y < 0)
        {
            velocity.y = -3f;
        }

        if (Input.GetButtonDown("Jump"))
        {
            velocity.y = jumpSpeed;
        }

        velocity.y -= this.gravity * Time.deltaTime;
        this.controller.Move(velocity * Time.deltaTime);
    }
}
