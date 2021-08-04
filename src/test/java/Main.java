import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class Main {
    public static void main(String[] args) {

        PInter inter = (PInter) Proxy.newProxyInstance(PInter.class.getClassLoader(), new Class<?>[]{PInter.class}, new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                System.out.println("invoke");
                return proxy;
            }
        });

        inter.value();

    }
}

interface PInter{
    public void value();
}
