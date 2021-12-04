package cn.jisol.mysql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.UUID;

public class Main {

    public static void main(String[] args) {
        long start = System.currentTimeMillis();    //  获取系统当前时间，方法开始执行前记录
        Connection conn = BaseDao.getConn();        //  调用刚刚写好的用于获取连接数据库对象的静态工具类
        String sql = "insert into usera (user_name,user_score) values(?,?)";  //  要执行的sql语句
        PreparedStatement ps = null;
        try {
            ps = conn.prepareStatement(sql);    //  获取PreparedStatement对象
            //  不断产生sql
            for (int i = 0; i < 20000; i++) {
                ps.setString(1, "极嗖乐:"+UUID.randomUUID().toString());
                ps.setLong(2, (long) Math.ceil(Math.random() * 1000000));
                ps.addBatch();  //  将一组参数添加到此 PreparedStatement 对象的批处理命令中。
            }
            int[] ints = ps.executeBatch();//   将一批命令提交给数据库来执行，如果全部命令执行成功，则返回更新计数组成的数组。
            //  如果数组长度不为0，则说明sql语句成功执行，即百万条数据添加成功！
            if (ints.length > 0) {
                System.out.println("已成功添加一百万条数据！！");
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        } finally {
            BaseDao.closeAll(conn, ps);  //  调用刚刚写好的静态工具类释放资源
        }
        long end = System.currentTimeMillis();  //  再次获取系统时间
        System.out.println("所用时长:" + (end - start) / 1000 + "秒");  //  两个时间相减即为方法执行所用时长
    }

    public static class BaseDao {  //  静态工具类，用于创建数据库连接对象和释放资源，方便调用
        //    导入驱动jar包或添加Maven依赖（这里使用的是Maven，Maven依赖代码附在文末）
        static {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
        }

        //  获取数据库连接对象
        public static Connection getConn() {
            Connection conn = null;
            try {
                //  rewriteBatchedStatements=true,一次插入多条数据，只插入一次
                conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/alonecore?rewriteBatchedStatements=true", "root", "123456");
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
            return conn;
        }

        //  释放资源
        public static void closeAll(AutoCloseable... autoCloseables) {
            for (AutoCloseable autoCloseable : autoCloseables) {
                if (autoCloseable != null) {
                    try {
                        autoCloseable.close();
                    } catch (Exception e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            }
        }
    }
}
