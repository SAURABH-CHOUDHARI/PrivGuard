import { faker } from "@faker-js/faker";

export function generateFakeUser() {
    return {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        username: faker.internet.userName(),
        password: faker.internet.password({ length: 12 }),
        avatar: faker.image.avatar(),
        bio: faker.lorem.sentence(),
    };
}
