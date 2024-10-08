import pkg from "pactum";
const { spec } = pkg;
import { expect, use } from "chai";
import { baseUrl, userID, username, secretPassword } from "./helpers/data.js";

let token;

describe("API tests", () => {
    it.skip("first test", async () => {
        const response = await spec().get(`${baseUrl}/BookStore/v1/Books`)
        .inspect();
        expect(response.statusCode).to.eql(200);
        expect(response.body.books);
        expect(response.body.books[0].title).to.eql("Git Pocket Guide");
        expect(response.body.books[4].author).to.eql("Kyle Simpson")
    });

    it.skip("Create user", async () => {
        const response = await spec()
        .post(`${baseUrl}/Account/v1/User`)
        .inspect()
        .withBody({
            userName: "adamP",
            password: "Haslo123#"
        });   
        expect(response.statusCode).to.eql(201)
    })
});

it("Generate token", async () => {
    const response = await spec()
    .post(`${baseUrl}/Account/v1/GenerateToken`)
    .withBody({
        userName: username,
        password: secretPassword
    });
    expect(response.statusCode).to.eql(200)
    token = response.body.token;
});

it("Show token", async () => {
    console.log(token);
});

it("Get userId", async () => {
    const response = await spec()
    .get(`${baseUrl}/Account/v1/User/${userID}`)
    .withBearerToken(token)
    expect(response.statusCode).to.eql(200);
})

it("Get books", async () => {
    const response = await spec()
    .get(`${baseUrl}/BookStore/v1/Books`)
    .withBearerToken(token)
    expect(response.statusCode).to.eql(200);
})


it.skip("Add book", async () => {
    const response = await spec()
    .post(`${baseUrl}/BookStore/v1/Books`)
    .withBearerToken(token)
    .withBody({
        "userId": userID,
        "collectionOfIsbns": [
          {
            "isbn": "9781449325862"
          }
        ]
    })
    expect(response.statusCode).to.eql(201);
})

it.skip("Delete book", async () => {
    const response = await spec()
    .delete(`${baseUrl}/BookStore/v1/Book`)
    .withBearerToken(token)
    .withBody({
            "isbn": "9781449325862",
            "userId": userID
    })
    .inspect()
    expect(response.statusCode).to.eql(204);
})

it("Delete book", async () => {
    const response = await spec()
        .delete(`${baseUrl}/BookStore/v1/Books?UserId=${userID}`)
        .withBearerToken(token)
   
    expect(response.statusCode).to.eql(204);
});