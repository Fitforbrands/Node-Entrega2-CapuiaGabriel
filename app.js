const fs = require("fs");

let validCode = [];

class ProductManager {
  constructor(path) {
    this.path = path;
    try {
      let productos = fs.readFileSync(this.path, "utf-8");
      this.productos = JSON.parse(productos);
    } catch {
      this.productos = [];
    }
  }

  async addProduct(item) {
    // agrego el primer producto
    if (this.productos.length === 0) {
      item.id = 1;
      // valido campos obligatios
      if (
        item.title === "" ||
        item.description === "" ||
        item.price === 0 ||
        item.thumbnail === "" ||
        item.code === "" ||
        item.stock === undefined
      ) {
        console.log(`El Item debe tener todos los campos cargados`);
      } else {
        console.log(`datos del item ${item.title} estan completos`);

        try {
          this.productos.push(item);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(this.productos, null, "\t")
          );
          console.log(`Product ${item.title} fue agregado`);
          //   console.log(productos);
        } catch (error) {
          console.log(`hubo un error al guardar los datos: ${error}`);
        }
      }
    } else {
      // segundo producto en adelante
      // recorro productos.code en cada producto y valido si existe
      //carga de productos en archivo
      for (let index = 0; index < this.productos.length; index++) {
        validCode.push(this.productos[index].code);
      }
      if (validCode.includes(item.code)) {
        console.log(`El codigo ${item.code} esta en uso`);
      } else {
        // valido campos obligatios
        if (
          item.title === "" ||
          item.description === "" ||
          item.price === 0 ||
          item.thumbnail === "" ||
          item.code === "" ||
          item.stock === undefined
        ) {
          console.log(`El Item debe tener todos los campos cargados`);
        } else {
          // agrego producto
          console.log(`datos del item ${item.title} estan completos`);
          item.id = this.productos[this.productos.length - 1].id + 1; // cargo Id incremental

          try {
            this.productos.push(item);
            await fs.promises.writeFile(
              this.path,
              JSON.stringify(this.productos, null, "\t")
            );
          } catch (error) {
            console.log(`hubo un error al guardar los datos: ${error}`);
          }

          console.log(`Product ${item.title} fue agregado`);
          console.log(productos);
        }
      }
    }
  }

  getProducts() {
    return this.productos;
  }

  getProductByid(id) {
    let byid = this.productos.filter((producto) => {
      return producto.id === id;
    });
    console.log("GET ELEMENT BY ID: " + id);
    if (byid.length === 0) {
      console.log("NOT FOUND");
    } else {
      console.log(byid);
    }
  }

  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    const pid = this.productos.find((p) => p.id === id);
    if (pid) {
      // update
      const index = this.productos.findIndex((p) => p.id === id);
      this.productos[index].title = title;
      this.productos[index].description = description;
      this.productos[index].price = price;
      this.productos[index].thumbnail = thumbnail;
      this.productos[index].code = code;
      this.productos[index].stock = stock;
      console.log("--------------------------");
      console.log("-----UPDATE PRODUCTS------");
      console.log("--------------------------");
      console.log(this.productos[index]);
      try {
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.productos, null, "\t")
        );
      } catch (error) {
        console.log(`hubo un error al actualizar los datos: ${error}`);
      }
    } else {
      console.log(`El Id: ${id} no existe`);
    }
  }

  async deleteProduct(id) {
    const producto = this.productos.find((p) => p.id === id);

    if (!producto) {
      return console.log("El producto no existe");
    }

    const index = this.productos.findIndex((p) => p.id === id);

    try {
      this.productos.splice(index, 1);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.productos, null, "\t")
      );
    } catch (error) {
      console.log(`Hubo un error al guardar los datos: ${error}`);
      return;
    }
  }
}

class Producto {
  constructor(id, title, description, price, thumbnail, code, stock) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

//TESTING

// cargo 3 productos
// En cada uno, valido code no repetido, campos obligatorios y se agrega Id autoincremental

const productos = new ProductManager("./productos.json");

const Perro = new Producto(
  "",
  "Perro",
  "Perro de juguete",
  500,
  "fotoPerro",
  "code3",
  345
);

const Gato = new Producto(
  "",
  "Gato",
  "Gato de juguete",
  700,
  "fotoGato",
  "code4",
  340
);

const Raton = new Producto(
  "",
  "Raton",
  "Raton de Juguete",
  500,
  "fotoRaton",
  "code5",
  345
);

// Agrego items al array principal de productos
productos.addProduct(Perro);
// productos.addProduct(Gato);
// productos.addProduct(Raton);

// Get Products
// console.log(productos.getProducts());

// Get Product by ID
// productos.getProductByid(1);

// Delete Product
// productos.deleteProduct(1);

// Update Product
// productos.updateProduct(
//   3,
//   "Raton",
//   "Raton de juguete",
//   599,
//   "fotoRaton",
//   "code3",
//   900
// );
