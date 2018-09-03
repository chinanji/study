# SpringMVC
openshift

## Step 1: 与openshift结合

1. openshift ---builds ----Configuration----GitHub Webhook URL 拷贝下来放入2
2. GitHub的源代码， settings---options---webhooks---Add webhook-----Payload URL粘贴，Content type选择：application/json

## Step 2: 建立SpringMVC meavn工程
#### 1. pom.xml

    <modelVersion>4.0.0</modelVersion>
        <groupId>com.springapp</groupId>
        <artifactId>SpringMVC</artifactId>
        <packaging>war</packaging>
        <version>1.0-SNAPSHOT</version>
        <name>SpringMVC</name>

    <properties>
        <spring.version>4.1.1.RELEASE</spring.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <!--dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>servlet-api</artifactId>
            <version>2.5</version>
        </dependency-->

        <dependency>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>jsp-api</artifactId>
            <version>2.1</version>
            <scope>provided</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>${spring.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.11</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <finalName>SpringMVC</finalName>
        <plugins>
            <plugin>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>1.6</source>
                    <target>1.6</target>
                </configuration>
            </plugin>
            <plugin>
                <artifactId>maven-surefire-plugin</artifactId>
                <configuration>
                    <includes>
                        <include>**/*Tests.java</include>
                    </includes>
                </configuration>
            </plugin>
        </plugins>
    </build>


#### 2. web.xml  
springmvc配置

    <display-name>Spring MVC Application</display-name>

    <servlet>
        <servlet-name>mvc-dispatcher</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <load-on-startup>1</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>mvc-dispatcher</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

#### 3. mvc-dispatcher-servlet.xml

    <context:component-scan base-package="com.wanhua.ben"/>

    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/pages/"/>
        <property name="suffix" value=".jsp"/>
    </bean>


#### 4. 编写控制器
`src\main\java\com\wanhua\ben\HelloController.java`

    package com.wanhua.ben;

    import org.springframework.stereotype.Controller;
    import org.springframework.ui.ModelMap;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RequestMethod;

    @Controller
    @RequestMapping("/")
    public class HelloController {
        @RequestMapping(method = RequestMethod.GET)
        public String printWelcome(ModelMap model) {
            model.addAttribute("message", "Hello world!ben!");
            return "hello";
        }
    }

#### 5. 编写前端jsp
`src\main\webapp\WEB-INF\pages\hello.jsp`

    <html>
    <body>
        <h1>${message}</h1>
        .....test.....
    </body>
    </html>


## Step 3. 解决中文字符乱码,去掉单元测试
1. web.xml增加：

    <filter>
        <filter-name>characterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <param-name>forceEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>characterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

2. pom.xml注释:

    <!--dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>servlet-api</artifactId>
        <version>2.5</version>
    </dependency-->

     <!--dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>${spring.version}</version>
        <scope>test</scope>
    </dependency-->

    <!--dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.11</version>
        <scope>test</scope>
    </dependency-->

    <!--plugin>
        <artifactId>maven-surefire-plugin</artifactId>
        <configuration>
            <includes>
                <include>**/*Tests.java</include>
            </includes>
        </configuration>
    </plugin-->

## Step 4: 使用postgresql
#### 1. 建表

CREATE TABLE student (
"student_id" varchar COLLATE "default" NOT NULL,
"name" varchar COLLATE "default",
"sex" varchar COLLATE "default",
"birthday" date,
"ts" timestamp(6),
PRIMARY KEY ("student_id")
)
WITH (OIDS=FALSE)
;

INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('1', '卡卡西', '男', '1981-7-16', '2016-12-1 00:01:06');
INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('2', 'zuro', '男', '1981-9-11', '2016-12-4 00:00:59');
INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('3', '女帝', '女', '1995-5-19', '2016-12-12 00:00:51');
INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('4', '乔巴', '男', '2016-12-7', '2016-12-15 00:00:04.752');
INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('5', '路飞', '男', '2016-11-28', '2016-12-15 00:04:26.184');
INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('6', '海贼王', '女', '2016-12-2', '2016-12-15 00:05:50.963');
INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('7', '赤南极', '男', '2016-12-7', '2016-12-15 00:08:44.835');
INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('8', '8', '8', '2016-12-1', '2016-12-15 00:09:01.748');

#### 2. pom.xml

    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <version>9.3-1102-jdbc4</version>
    </dependency>

#### 3. HelloController.java改造


    @Controller
    @RequestMapping("/")
    public class HelloController {
    @RequestMapping(method = RequestMethod.GET)
    public String printWelcome(ModelMap model) {

        String sql = "select * from student";

        // 连接字符串，格式： "jdbc:数据库驱动名称://数据库服务器ip/数据库名称"
        String url = "jdbc:postgresql://localhost:5432/ec";
        String username = "root";
        String password = "";

        try{
            Class.forName("org.postgresql.Driver").newInstance();

            Connection conn = DriverManager.getConnection(url, username, password);
            Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
            ResultSet  rs   = stmt.executeQuery(sql);

            String rtnMsg = "";

            while(rs.next())
            {
                rtnMsg += "name:"+rs.getString(2) + ",sex:"+rs.getString(3)+"</br>";
            }

            model.addAttribute("message",rtnMsg );

            rs.close();
            stmt.close();
            conn.close();


        }catch (Exception e) {
            model.addAttribute("message", "Hello world!ben! Exception:"+e);
        }

        return "hello";
    }
    }

#### 4. openshift 建立pgsql db镜像
完成之后， 登录pod---Terminal 然后登录数据库
    
    psql -h 127.0.0.1 -U userT07 -d sampledb 

    \c sampledb

    CREATE TABLE student (
    "student_id" varchar COLLATE "default" NOT NULL,
    "name" varchar COLLATE "default",
    "sex" varchar COLLATE "default",
    "birthday" date,
    "ts" timestamp(6),
    PRIMARY KEY ("student_id")
    )
    WITH (OIDS=FALSE)
    ;

    INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('1', '卡卡西', '男', '1981-7-16', '2016-12-1 00:01:06');
    INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('2', 'zuro', '男', '1981-9-11', '2016-12-4 00:00:59');
    INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('3', '女帝', '女', '1995-5-19', '2016-12-12 00:00:51');
    INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('4', '乔巴', '男', '2016-12-7', '2016-12-15 00:00:04.752');
    INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('5', '路飞', '男', '2016-11-28', '2016-12-15 00:04:26.184');
    INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('6', '海贼王', '女', '2016-12-2', '2016-12-15 00:05:50.963');
    INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('7', '赤南极', '男', '2016-12-7', '2016-12-15 00:08:44.835');
    INSERT INTO "student" ("student_id", "name", "sex", "birthday", "ts") VALUES ('8', '8', '8', '2016-12-1', '2016-12-15 00:09:01.748');

#### 5. 修改HelloController.java代码


    @Controller
    @RequestMapping("/")
    public class HelloController {
    @RequestMapping(method = RequestMethod.GET)
    public String printWelcome(ModelMap model) {

        String sql = "select * from student";
        String url = "jdbc:postgresql://postgresql:5432/sampledb";
        String username = "userT07";
        String password = "FjrT7cOgB2ReY8Dm";


## Step 5: 资源目录调整
    将xml等配置文件放入resource目录下

#### 1. 新建resource目录
- `src/main/resource` :作为备忘目录
- `src/main/resource.dev` :dev
- `src/main/resource.prd` :prd

#### 2. 修改pom.xml
    <profiles>
        <profile>
            <!-- 本地开发环境 -->
            <id>dev</id>
            <properties>
                <deploy.type>dev</deploy.type>
            </properties>
            <activation>
                <activeByDefault>false</activeByDefault>
            </activation>
        </profile>
        <profile>
            <!-- 生产环境 -->
            <id>prd</id>
            <properties>
                <deploy.type>prd</deploy.type>
            </properties>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
        </profile>
    </profiles>

     <build>
        <finalName>SpringMVC</finalName>
        <plugins>
            <plugin>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>1.6</source>
                    <target>1.6</target>
                </configuration>
            </plugin>
            <!-- resource插件 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <version>2.7</version>
            </plugin>



            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>2.2</version>
                <configuration>
                    <failOnMissingWebXml>false</failOnMissingWebXml>
                    <webResources>
                        <resource>
                        <directory>${basedir}/src/main/resource.${deploy.type}</directory>
                        <targetPath>WEB-INF/classes</targetPath>
                        <filtering>true</filtering>
                    </resource>
                    </webResources>
                </configuration>
            </plugin>
        </plugins>
    </build>

#### 3. mvc-dispatcher-servlet.xml改造
     <context:property-placeholder location="classpath*:jdbc.properties" />

      <bean id="dataSource" class="org.apache.tomcat.jdbc.pool.DataSource"
          destroy-method="close" autowire="no">
        <property name="fairQueue" value="false" />
        <property name="minIdle" value="1" />
        <property name="maxIdle" value="5" />
        <property name="maxActive" value="5" />
        <property name="initialSize" value="1" />
        <property name="testOnBorrow" value="true" />
        <property name="validationQuery" value="select 1" />
        <property name="validationInterval" value="500000" /><!-- 5min -->
        <property name="removeAbandoned" value="true" />
        <property name="removeAbandonedTimeout" value="30" />
        <property name="driverClassName" value="${jdbc.driver}" />
        <property name="url" value="${jdbc.url}" />
        <property name="username" value="${jdbc.username}" />
        <property name="password" value="${jdbc.password}" />
    </bean>

    并且放入`src/main/resource` `src/main/resource.dev`  `src/main/resource.prd`

#### 4. 建立jdbc.properties
    #postgresql
    jdbc.driver=org.postgresql.Driver
    jdbc.url=jdbc:postgresql://localhost:5432/ec
    jdbc.username=root
    jdbc.password=
    jdbc.defaultAutoCommit=true

    并且放入`src/main/resource` `src/main/resource.dev`  `src/main/resource.prd`

#### 5.修改代码
    @Controller
    @RequestMapping("/")
    public class HelloController {
        @RequestMapping(method = RequestMethod.GET)
        public String printWelcome(ModelMap model) {

        String sql = "select * from student";

        try{
            ApplicationContext ctx = new ClassPathXmlApplicationContext("mvc-dispatcher-servlet.xml");
            DataSource ds = ctx.getBean("dataSource", DataSource.class);
            Connection conn = ds.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);

            String rtnMsg = "";

            while(rs.next())
            {
                rtnMsg += "name:"+rs.getString(2) + ",sex:"+rs.getString(3)+"</br>";
            }

            model.addAttribute("message",rtnMsg );

            rs.close();
            stmt.close();
            conn.close();


        }catch (Exception e) {
            model.addAttribute("message", "Hello world!ben! Exception:"+e);
        }

        return "hello";
    }
    }



## Step 5: 使用redis 缓存
#### 1. openshift 拉取redis镜像

#### 2. meavn代码改造
