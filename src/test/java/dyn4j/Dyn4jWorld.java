package dyn4j;

import org.dyn4j.dynamics.Body;
import org.dyn4j.geometry.Ellipse;
import org.dyn4j.geometry.MassType;
import org.dyn4j.geometry.Rectangle;
import org.dyn4j.geometry.Vector2;
import org.dyn4j.world.World;

public class Dyn4jWorld {

    public static void main(String[] args) {

        /*------创建世界------*/
        World<Body> world = new World<Body>();//创建世界
        world.setGravity(new Vector2(0,-10));//重力加速度设为10m·s^(-2)
        //以下是另外两种写法
        // world.setGravity(0,-10);
        // world.setGravity(Vector2.create(10,-Math.PI/2));
        world.getSettings().setStepFrequency(1);//设置步频，两次计算间隔1毫秒
        /*------创建世界------*/

        /*------创建实体------*/
        Body ball = new Body();//创建容器存放小球
        ball.addFixture(new Ellipse(0.1,0.1));//创建小球并加入容器，宽高均为0.1m，即半径0.05m
        ball.getTransform().setTranslationY(1000);//将小球的Y坐标设为10m
        ball.setMass(MassType.NORMAL);//自动计算小球的质量

        Body ground = new Body();//同样的方法创建地面
        ground.addFixture(new Rectangle(100,0.1));//地面是一个长方形，宽100m，高0.1m
        ground.getTransform().setTranslationY(-0.05);//将地面下移0.05m，保证地面上沿的Y坐标为0
        ground.setMass(MassType.INFINITE);//将质量设为无穷大，即不会发生位移或旋转

        world.addBody(ball);//将刚才创建的两个Body加入世界
        world.addBody(ground);
        /*------创建实体------*/

        /*------模拟------*/
        double oldValue=-1,cur;

        while(true) {

            world.step(1);//步进100，刚才设置了步频是0.001s，计算100次就相当于过了0.1s

            cur=ball.getTransform().getTranslationY();//获取小球Y坐标，即高度

            if(cur==oldValue) break;//如果新的高度等于旧的高度，说明小球停止运动，结束程序
            oldValue=cur;//更新旧高度

            System.out.printf("%fm\n",cur);//按要求输出
        }

        /*------模拟------*/

    }

}
