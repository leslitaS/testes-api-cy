/// <reference types="cypress" />
import contratoUsuario from '../contracts/usuarios.contract'
describe("Testes da Funcionalidade Usuários", () => {
     let token;

     before(() => {
          cy.token("fulano@qa.com", "teste").then((tkn) => {
               token = tkn;
          });
     });

     it("Deve validar contrato de usuários", () => {
          //TODO:
          cy.request('usuarios').then(response =>{
               return contratoUsuario.validateAsync(response.body)
          })
     });

     it("Deve listar usuários cadastrados", () => {
          //TODO:
          cy.request({
               method: "GET",
               url: "usuarios",
          }).then((response) => {
               expect(response.status).to.equal(200);
               expect(response.body).to.have.property("usuarios");
               expect(response.duration).to.lessThan(35);
          });
     });

     it("Deve cadastrar um usuário com sucesso", () => {
          //TODO:
          let email = `leslita${Math.floor(Math.random() * 1000)}@qa.com.br`;
          cy.request({
               method: "POST",
               url: "usuarios",
               body: {
                    nome: "Leslie gamarra",
                    email: email,
                    password: "teste",
                    administrador: "true",
               },
               headers: { authorization: token },
          }).then((response) => {
               expect(response.status).to.equal(201);
               expect(response.body.message).to.equal("Cadastro realizado com sucesso");
          });
     });

     it("Deve validar um usuário com email inválido", () => {
          //TODO:
          cy.cadastrarUsuario(token,"Fulano da Silva", "beltrano@qa.com.br", "teste", "true")
               .then((response) => {
                    //expect(response.status).to.equal(400);
                    expect(response.body.message).to.equal("Este email já está sendo usado");
               });
     });

     it("Deve editar um usuário previamente cadastrado", () => {
          //TODO:
          let email = `fulano${Math.floor(Math.random() * 1000)}@qa.com.br`;
          cy.cadastrarUsuario(token,"Fulano a modificar", email, "teste", "true")
               .then((response) => {
               let id = response.body._id;
               cy.request({
                    method: "PUT",
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
                    body: {
                         nome: "Fulano da Silva mod",
                         email: email,
                         password: "teste",
                         administrador: "true"
                    }
               }).then(response => {
                   // expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal("Registro alterado com sucesso")
               })
          })
         
     });

     it("Deve deletar um usuário previamente cadastrado", () => {
          //TODO:
          let email = `fulano${Math.floor(Math.random() * 1000)}@qa.com.br`;
          cy.cadastrarUsuario(token,"Fulano a eliminar", email, "teste", "true")
               .then((response) => {
               let id = response.body._id;
               cy.request({
                    method: "DELETE",
                    url: `usuarios/${id}`,
                    headers: { authorization: token }
                   
               }).then(response => {
                    expect(response.body.message).to.equal("Registro excluído com sucesso")
                    expect(response.status).to.equal(200)
               })
          })
         
     })
});
