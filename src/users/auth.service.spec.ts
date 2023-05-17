import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException } from "@nestjs/common";

describe("AuthService", () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const  filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 9999), email, password } as User;

        users.push(user);

        return Promise.resolve(user);
      }
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get(AuthService);
  });
  it("should ", async function() {
    expect(service).toBeDefined();
  });

  it("create user", async () => {
    const user = await service.signup("test@test.com", "asdf");
    expect(user.password).not.toEqual("asdf");
    const [salt, hash] = user.password.split(".");
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it("Duplicate email not acceptable", async () => {
    await service.signup('asdf@asd.com', 'asdf')

    try {
      await service.signup("asdf@asd.com", "asdf")
    } catch (err) {
      expect(err.message).toMatch('email in use');
    }
  });

  it("signin",  (done) => {
    service.signin('asd@asd.com', 'sdc')
      .then(res => {
        console.log(res);
      }).catch(err => {
      done();
    });
  });

  it("Invalid password", async () => {
    await service.signup('asdf@asd.com', 'asdf')

    try {
      await service.signin("asdf@asd.com", "ascdf")
    } catch (err) {
      expect(err.message).toMatch('Bad password');
    }
  });

  it("Correct password", async () => {
    await service.signup('asdf@as.com', 'password');

    const user = await service.signin('asdf@as.com', 'password');

    expect(user).toBeDefined();
  });
});