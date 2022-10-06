const request = require("supertest");
const { myDataSource } = require("../models/typeorm-client");
const { createApp } = require("../app");

//USER TEST
describe("USER TEST", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await myDataSource.initialize();
  });

  afterAll(async () => {
    await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
    await myDataSource.query(`TRUNCATE users`);
    await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    await myDataSource.destroy();
  });

  //BASIC TEST
  describe("BASIC TEST", () => {
    test("PINGPONG", async () => {
      await request(app).get("/ping").expect(200).expect({ message: "pong" });
    });

    //   test("WRONG DIRECTION", async () => {
    // // 경로 잘못 빠질경우
    //     await request(app)
    //       .get("/users/hello")
    //       .expect(404)
    //       .expect({ message: "WRONG DIRECTION" });
    //   });
  });

  // CREATE TEST
  describe("CREATE USER TEST", () => {
    beforeAll(async () => {
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
      await myDataSource.query(`TRUNCATE users`);
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
      await myDataSource.query(`
      INSERT INTO users (name, birth, height, phone, deleted)
      VALUES
      ("Kimcode", "1997-08-19", 157.2, "010-0000-0000", "false")`);
    });

    afterAll(async () => {
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
      await myDataSource.query(`TRUNCATE users`);
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    });

    const signUp = async (obj) => {
      return await request(app).post("/users").send({ data: obj });
    };

    test("SUCCESS: SIGN UP", async () => {
      const obj = {
        name: "test",
        birth: "2022-09-21",
        height: 158.2,
        phone: "010-1234-5678",
      };
      const res = await signUp(obj);
      expect(res.status).toBe(200);
      expect(JSON.parse(res.text)).toEqual({ message: "회원 등록 성공" });
    });

    test("FAIL: DUPLICATED USER", async () => {
      const obj = {
        name: "Kimcode",
        birth: "1997-08-19",
        height: 157.2,
        phone: "010-0000-0000",
      };
      const res = await signUp(obj);
      expect(res.status).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        message: "이미 등록된 phone입니다.",
      });
    });

    test("FAIL: MISSING VALUE 1", async () => {
      const obj = {
        name: "missingtest",
        birth: "2022-09-22",
        height: 164.8,
        phone: "",
      };
      const res = await signUp(obj);
      expect(res.status).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        message: "누락된 정보가 있습니다.",
      });
    });

    test("FAIL: MISSING VALUE 2", async () => {
      const obj = {
        birth: "2022-09-22",
        height: 164.8,
        phone: "010-5678-1234",
      };
      const res = await signUp(obj);
      expect(res.status).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        message: "누락된 정보가 있습니다.",
      });
    });

    // test("FAIL: MISSING VALUE 3", async () => {
    //   // body가 오지 않은 경우
    //   const res = await signUp();
    //   expect(res.status).toBe(400);
    //   expect(JSON.parse(res.text)).toEqual({
    //     message: "누락된 정보가 있습니다.",
    //   });
    // });

    test("FAIL: INVALID NAME", async () => {
      const obj = {
        name: "test@!",
        birth: "2009-09-09",
        height: 164.8,
        phone: "010-5678-1234",
      };
      const res = await signUp(obj);
      expect(res.status).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        message: "유효하지 않은 name입니다.",
      });
    });

    test("FAIL: INVALID BIRTH DATA", async () => {
      const obj = {
        name: "invaildtest",
        birth: "2009-09-00",
        height: 164.8,
        phone: "010-5678-1234",
      };
      const res = await signUp(obj);
      expect(res.status).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        message: "유효하지 않은 birth입니다.",
      });
    });

    // test("FAIL: INVALID HEIGHT", async () => {
    //   //범위를 벗어나는 height 예외 처리
    //   const obj = {
    //     name: "invalidtest",
    //     birth: "2009-09-01",
    //     height: 1648.8,
    //     phone: "010-5678-1234",
    //   };
    //   const res = await signUp(obj);
    //   expect(res.status).toBe(400);
    //   expect(JSON.parse(res.text)).toEqual({
    //     message: "유효하지 않은 height입니다.",
    //   });
    // });

    test("FAIL: INVALID PHONE", async () => {
      const obj = {
        name: "invalidtest",
        birth: "2009-09-01",
        height: 164.8,
        phone: "010-0000-00",
      };
      const res = await signUp(obj);
      expect(res.status).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        message: "유효하지 않은 phone입니다.",
      });
    });

    // test("FAIL: TOO LONG NAME", async () => {
    //   //데이터 길이 유효성 검사
    //   const obj = {
    //     name: "asdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgg",
    //     birth: "2009-09-01",
    //     height: 164.8,
    //     phone: "010-5678-1234",
    //   };
    //   const res = await signUp(obj);
    //   expect(res.status).toBe(400);
    //   expect(JSON.parse(res.text)).toEqual({
    //     message: "데이터 길이 유효성",
    //   });
    // });
  });

  // GET ALL
  describe("GET ALL USER DATA TEST", () => {
    beforeAll(async () => {
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
      await myDataSource.query(`TRUNCATE users`);
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
      await myDataSource.query(`
      INSERT INTO users (name, birth, height, phone, deleted)
      VALUES 
      ("Kimcode", "1997-08-19", 157.2, "010-0000-0000","false"),
      ("Leecoder", "1989-10-15", 161, "010-1111-1111","false"),
      ("***", "1992-**-**", 167.4, "***-****-****","true"),
      ("Kangdata", "2000-01-01", 172.6, "010-3333-3333","false"),
      ("Choiquery", "2003-01-31", 179.1, "010-4444-4444","false"),
      ("Jodebug", "2007-05-30", 182.5, "010-5555-5555","false")`);
    });

    afterAll(async () => {
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
      await myDataSource.query(`TRUNCATE users`);
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    });

    const getAllUser = async () => {
      return await request(app).get("/users");
    };

    // test("SUCCESS: GET ALL USER DATA", async () => {
    //   // deleted user 예외처리
    //   const res = await getAllUser();
    //   expect(res.status).toBe(200);
    //   expect(JSON.parse(res.text)).toEqual({
    //     message: "모든 회원 정보 가져오기 성공!",
    //     result: [
    //       {
    //         id: 1,
    //         name: "Kimcode",
    //         birth: "1997-08-19",
    //         height: "157.2",
    //         phone: "010-0000-0000",
    //         deleted: "false",
    //       },
    //       {
    //         id: 2,
    //         name: "Leecoder",
    //         birth: "1989-10-15",
    //         height: "161.0",
    //         phone: "010-1111-1111",
    //         deleted: "false",
    //       },
    //       {
    //         id: 4,
    //         name: "Kangdata",
    //         birth: "2000-01-01",
    //         height: "172.6",
    //         phone: "010-3333-3333",
    //         deleted: "false",
    //       },
    //       {
    //         id: 5,
    //         name: "Choiquery",
    //         birth: "2003-01-31",
    //         height: "179.1",
    //         phone: "010-4444-4444",
    //         deleted: "false",
    //       },
    //       {
    //         id: 6,
    //         name: "Jodebug",
    //         birth: "2007-05-30",
    //         height: "182.5",
    //         phone: "010-5555-5555",
    //         deleted: "false",
    //       },
    //     ],
    //   });
    // });

    test("SUCCESS: NO USER DATA", async () => {
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
      await myDataSource.query(`TRUNCATE users`);
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);

      const res = await getAllUser();
      expect(res.status).toBe(200);
      expect(JSON.parse(res.text)).toEqual({
        message: "모든 회원 정보 가져오기 성공!",
        result: [],
      });
    });
  });

  // GET
  describe("GET USER TEST", () => {
    beforeAll(async () => {
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
      await myDataSource.query(`TRUNCATE users`);
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
      await myDataSource.query(`
      INSERT INTO users (name, birth, height, phone, deleted)
      VALUES
      ("Kimcode", "1997-08-19", 157.2, "010-0000-0000","false"),
      ("Leecoder", "1989-10-15", 161, "010-1111-1111","false"),
      ("***", "1992-**-**", 167.4, "***-****-****","true"),
      ("Kangdata", "2000-01-01", 172.6, "010-3333-3333","false"),
      ("Choiquery", "2003-01-31", 179.1, "010-4444-4444","false"),
      ("Jodebug", "2007-05-30", 182.5, "010-5555-5555","false")`);
    });

    afterAll(async () => {
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
      await myDataSource.query(`TRUNCATE users`);
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    });

    const getUser = async (id) => {
      return await request(app).get(`/users/${id}`);
    };

    test("SUCCESS: GET USER DATA", async () => {
      const res = await getUser(1);
      expect(res.status).toBe(200);
      expect(JSON.parse(res.text)).toEqual({
        message: "회원 정보 가져오기 성공!",
        result: {
          id: 1,
          name: "Kimcode",
          birth: "1997-08-19",
          height: "157.2",
          phone: "010-0000-0000",
          deleted: "false",
        },
      });
    });

    test("SUCCESS: NO USER", async () => {
      const res = await getUser(99);
      expect(res.status).toBe(404);
      expect(JSON.parse(res.text)).toEqual({
        message: "존재하지 않는 user_id입니다.",
      });
    });

    // test("SUCCESS: DELETED USER", async () => {
    //   // deleted user 예외처리
    //   const res = await getUser(3);
    //   expect(res.status).toBe(404);
    //   expect(JSON.parse(res.text)).toEqual({
    //     message: "존재하지 않는 user_id입니다.",
    //   });
    // });
  });

  // UPDATE
  describe("UPDATE USER DATA TEST", () => {
    beforeAll(async () => {
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
      await myDataSource.query(`TRUNCATE users`);
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
      await myDataSource.query(`
      INSERT INTO users (name, birth, height, phone, deleted)
      VALUES
      ("Kimcode", "1997-08-19", 157.2, "010-0000-0000","false"),
      ("Leecoder", "1989-10-15", 161, "010-1111-1111","false"),
      ("***", "1992-**-**", 167.4, "***-****-****","true"),
      ("Kangdata", "2000-01-01", 172.6, "010-3333-3333","false"),
      ("Choiquery", "2003-01-31", 179.1, "010-4444-4444","false"),
      ("Jodebug", "2007-05-30", 182.5, "010-5555-5555","false")`);
    });

    afterAll(async () => {
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
      await myDataSource.query(`TRUNCATE users`);
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    });

    const updateUser = async (obj) => {
      return await request(app).post("/users/update").send({ data: obj });
    };

    test("SUCCESS: USER UPDATED", async () => {
      const obj = {
        user_id: 1,
        name: "nameupdated",
        birth: "2022-09-21",
        height: 158.2,
        phone: "010-1234-5678",
      };
      const res = await updateUser(obj);
      expect(res.status).toBe(200);
      expect(JSON.parse(res.text)).toEqual({ message: "회원 정보 수정 성공!" });
    });

    test("FAIL: NO USER", async () => {
      const obj = {
        user_id: 99,
        name: "test",
        birth: "2022-09-21",
        height: 158.2,
        phone: "010-5678-1234",
      };
      const res = await updateUser(obj);
      expect(res.status).toBe(404);
      expect(JSON.parse(res.text)).toEqual({
        message: "존재하지 않는 user_id입니다.",
      });
    });

    // test("FAIL: DUPLICATED USER", async () => {
    //   //업데이트 유저 중복 검사(전화번호)
    //   const obj = {
    //     user_id: 2,
    //     name: "test",
    //     birth: "2022-09-01",
    //     height: 152.7,
    //     phone: "010-5555-5555",
    //   };
    //   const res = await updateUser(obj);
    //   expect(res.status).toBe(400);
    //   expect(JSON.parse(res.text)).toEqual({
    //     message: "이미 존재하는 회원입니다.",
    //   });
    // });

    // test("FAIL: NO RECEIVED DATA", async () => {
    //   //body가 오지 않은 경우 예외처리
    //   expect(await updateUser())
    //     .toBe(400)
    //     .toBe({ message: "누락된 정보가 있습니다." });
    // });

    test("FAIL: MISSTING DATA ERROR 1", async () => {
      const obj = {
        user_id: 2,
        birth: "2022-09-21",
        height: 158.2,
        phone: "010-5678-1234",
      };
      const res = await updateUser(obj);
      expect(res.status).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        message: "누락된 정보가 있습니다.",
      });
    });

    test("FAIL: MISSTING DATA ERROR 2", async () => {
      const obj = {
        name: "test",
        birth: "2022-09-21",
        height: 158.2,
        phone: "010-5678-1234",
      };
      const res = await updateUser(obj);
      expect(res.status).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        message: "누락된 정보가 있습니다.",
      });
    });

    test("FAIL: MISSTING DATA ERROR 3", async () => {
      const obj = {
        user_id: 2,
        name: "test",
        birth: "2022-09-21",
        height: 158.2,
        phone: "",
      };
      const res = await updateUser(obj);
      expect(res.status).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        message: "누락된 정보가 있습니다.",
      });
    });

    test("FAIL: MISSTING DATA ERROR 4", async () => {
      const obj = {
        user_id: 2,
        name: "test",
        birth: "2022-09-21",
      };
      const res = await updateUser(obj);
      expect(res.status).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        message: "누락된 정보가 있습니다.",
      });
    });

    test("FAIL: INVAILD NAME", async () => {
      const obj = {
        user_id: 2,
        name: "test@!",
        birth: "2022-09-21",
        height: 158.2,
        phone: "010-5678-1234",
      };
      const res = await updateUser(obj);
      expect(res.status).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        message: "유효하지 않은 name입니다.",
      });
    });

    test("FAIL: INVAILD PHONE", async () => {
      const obj = {
        user_id: 2,
        name: "test",
        birth: "2022-09-21",
        height: 158.2,
        phone: "010-0000-000a",
      };
      const res = await updateUser(obj);
      expect(res.status).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        message: "유효하지 않은 phone입니다.",
      });
    });

    test("FAIL: INVAILD BIRTH", async () => {
      const obj = {
        user_id: 2,
        name: "test",
        birth: "2022-09-00",
        height: 152.9,
        phone: "010-5678-1234",
      };
      const res = await updateUser(obj);
      expect(res.status).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        message: "유효하지 않은 birth입니다.",
      });
    });

    // test("FAIL: INVAILD HEIGHT", async () => {
    // // 범위를 벗어나는 키 예외처리
    //   const obj = {
    //     user_id: 2,
    //     name: "test",
    //     birth: "2022-09-21",
    //     height: 1529.7,
    //     phone: "010-5678-1234",
    //   };
    //   const res = await updateUser(obj);
    //   expect(res.status).toBe(400);
    //   expect(JSON.parse(res.text)).toEqual({ message: "유효하지 않은 height입니다." });
    // });

    // test("FAIL: TOO LONG NAME", async () => {
    //   // 데이터 길이가 너무 긴 경우 예외처리
    //   const obj = {
    //     user_id: 2,
    //     name: "asdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgg",
    //     birth: "2022-09-21",
    //     height: 152.7,
    //     phone: "010-5678-1234",
    //   };
    //   const res = await updateUser(obj);
    //   expect(res.status).toBe(400);
    //   expect(JSON.parse(res.text)).toEqual({ message: "이름 길이 유효성" });
    // });
  });

  // DELETE
  describe("DELETE USER TEST", () => {
    beforeAll(async () => {
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
      await myDataSource.query(`TRUNCATE users`);
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
      await myDataSource.query(`
      INSERT INTO users (name, birth, height, phone, deleted)
      VALUES
      ("Kimcode", "1997-08-19", 157.2, "010-0000-0000","false"),
      ("Leecoder", "1989-10-15", 161, "010-1111-1111","false"),
      ("***", "1992-**-**", 167.4, "***-****-****","true"),
      ("Kangdata", "2000-01-01", 172.6, "010-3333-3333","false"),
      ("Choiquery", "2003-01-31", 179.1, "010-4444-4444","false"),
      ("Jodebug", "2007-05-30", 182.5, "010-5555-5555","false")`);
    });

    afterAll(async () => {
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
      await myDataSource.query(`TRUNCATE users`);
      await myDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    });

    const deleteUser = async (user_id) => {
      return await request(app).delete(`/users/delete/${user_id}`);
    };

    test("SUCCESS: USER DELETED", async () => {
      expect((await deleteUser(1)).status).toBe(204);
    });

    test("FAIL: NO USER", async () => {
      const res = await deleteUser(99);
      expect(res.status).toBe(404);
      expect(JSON.parse(res.text)).toEqual({
        message: "존재하지 않는 user_id입니다.",
      });
    });

    // test("FAIL: DELETED USER", async () => {
    //   // deleted user 예외처리
    //   const res = await deleteUser(3);
    //   expect(res.status).toBe(404);
    //   expect(JSON.parse(res.text)).toEqual({
    //     message: "존재하지 않는 user_id입니다.",
    //   });
    // });
  });
});
