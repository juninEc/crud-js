"use strict";

// Aimação entre input e label, para quando o campo estiver preenchido
const inputElements = document.querySelectorAll(".box-input input");
inputElements.forEach((input) => {
  input.addEventListener("input", function () {
    if (input.value.trim() !== "") {
      input.nextElementSibling.style.transform = "translateY(-20px)";
      input.nextElementSibling.style.fontSize = "12px";
      input.nextElementSibling.style.color = "var(--principal)";
    } else {
      input.nextElementSibling.style.transform = "none";
      input.nextElementSibling.style.fontSize = "14px";
      input.nextElementSibling.style.color = "#808080";
    }
  });
});

const openRegister = () => {
  document.getElementById("register-box").classList.add("active");
};

const closeRegister = () => {
  document.getElementById("register-box").classList.remove("active");
  clearFields();
};

const getLocalStorage = () => JSON.parse(localStorage.getItem("db_Server")) ?? [];
const setLocalStorage = (dbServer) => localStorage.setItem("db_Server", JSON.stringify(dbServer));

//CRUD - create, read, update e delete
const deleteServer = (index) => {
  const dbServer = readServer();
  dbServer.splice(index, 1);
  setLocalStorage(dbServer);
  updateTable();
};

const updateServer = (index, server) => {
  const dbServer = readServer();
  dbServer[index] = server;
  setLocalStorage(dbServer);
};

const readServer = () => getLocalStorage();

const creatServer = (server) => {
  const dbServer = getLocalStorage();
  dbServer.push(server);
  setLocalStorage(dbServer);
};

const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};

const clearFields = () => {
  const fields = document.querySelectorAll(".box-field");
  fields.forEach((field) => (field.value = ""));
  document.getElementById("nome").dataset.index = "new";
};


const saveServer = () => {
  if (isValidFields()) {
    const server = {
      nome: document.getElementById("nome").value,
      cpf: document.getElementById("cpf").value,
      telefone: document.getElementById("telefone").value,
      email: document.getElementById("email").value,
    };
    const index = document.getElementById("nome").dataset.index;
    if (index == "new") {
      creatServer(server);
      updateTable();
      closeRegister();
    } else {
      updateServer(index, server);
      updateTable();
      closeRegister();
    }
  }
};

const creatRow = (server, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
  <td>${server.nome}</td>
  <td>${server.cpf}</td>
  <td>${server.telefone}</td>
  <td>${server.email}</td>
  <td>
  <img src="img/edit.png" alt="editar" onclick="editServer(${index})" class="img-button">
  <img src="img/delete.png" alt="excluir" onclick="deleteServer(${index})" class="img-button">
  </td>`;

  document.querySelector("#tableRegister>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableRegister>tbody tr");
  rows.forEach(row => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbServer = readServer();
  clearTable();
  dbServer.forEach(creatRow); 
};

const fillFields = (server) => {
  document.getElementById("nome").value = server.nome;
  document.getElementById("cpf").value = server.cpf;
  document.getElementById("telefone").value = server.telefone;
  document.getElementById("email").value = server.email;
  document.getElementById("nome").dataset.index = server.index;
};

window.editServer = (index) => {
  const server = readServer()[index];
  server.index = index;
  fillFields(server);
  document.querySelector(".register-header>p").textContent  = "Editar Informações"; 
  const labelElements = document.querySelectorAll(".box-input label");
  labelElements.forEach((label) => {
    label.innerHTML = " "
  }); 
  openRegister();
};

updateTable();

//Atividades dos botões 
document.getElementById("button-register").addEventListener("click", openRegister);
document.getElementById("close").addEventListener("click", closeRegister);
document.getElementById("cancel").addEventListener("click", closeRegister);
document.getElementById("save").addEventListener("click", saveServer);
