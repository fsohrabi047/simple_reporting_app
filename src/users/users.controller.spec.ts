import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne(id: number): Promise<User | null> {
        return Promise.resolve({id, email: 'asdf@asdf.com', password: 'sd'} as User);
      },
      find(email: string): Promise<User[]> {
        return Promise.resolve([{id: 1, email, password: 'asc'} as User]);
      },
      // async remove(id: number): Promise<User> {
      //
      // },
      // async update(id: number, attrs: Partial<User>): Promise<User> {
      // }
    };

    fakeAuthService = {
      // async signup(email: string, password: string): Promise<User> {
      // },
      async signin(email: string, password: string): Promise<User> {
        return Promise.resolve({id: 1, email, password} as User);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("find all users", async () => {
    const users = await controller.findAllUsers('asdf@asdf.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it("find user with the specified id", async () => {
    const user = await controller.findUser('1');

    expect(user).toBeDefined();
  });

  it("User not found with the specified id", async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);

    try {
      await controller.findUser('1dd')
    } catch (err) {
      expect(err.message).toEqual('user not found')
    }
  });

  it("sign in", async () => {
    const session = {userId: -1 };

    const user = await controller.signin({email: 'asdf@asdf.com', password: 'as'}, session)

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
