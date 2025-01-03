const DecorativeShapes = () => {
  return (
    <>
      {/* Semi-círculo principal atrás da imagem */}
      <div
        className="fixed-shape-right"
        style={{
          position: "absolute",
          right: "-20%",
          top: "50%",
          width: "800px",
          height: "800px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      />

      {/* Círculo decorativo superior */}
      <div
        className="fixed-shape-top"
        style={{
          position: "absolute",
          left: "-5%",
          top: "-50px",
          width: "300px",
          height: "300px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />

      {/* Semicírculo decorativo inferior */}
      <div
        className="fixed-shape-bottom"
        style={{
          position: "absolute",
          left: "25%",
          bottom: "-25%",
          width: "250px",
          height: "250px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />
    </>
  );
};

const ServicesDecorativeShapes = () => {
  return (
    <>
      {/* Semi-círculo grande à esquerda */}
      <div
        className="fixed-shape-left"
        style={{
          position: "absolute",
          left: "-15%",
          top: "50%",
          width: "500px",
          height: "500px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      />

      {/* Círculo menor no canto superior direito */}
      <div
        className="fixed-shape-top-right"
        style={{
          position: "absolute",
          right: "10%",
          top: "-5%",
          width: "200px",
          height: "200px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />

      {/* Semicírculo médio no canto inferior direito */}
      <div
        className="fixed-shape-bottom-right"
        style={{
          position: "absolute",
          right: "-10%",
          bottom: "5%",
          width: "350px",
          height: "350px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />

      {/* Círculo pequeno no canto inferior esquerdo */}
      <div
        className="fixed-shape-bottom-left"
        style={{
          position: "absolute",
          left: "15%",
          bottom: "-10%",
          width: "150px",
          height: "150px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />
    </>
  );
};
const GalleryDecorativeShapes = () => {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {/* Semi-círculo grande superior */}
      <div
        style={{
          position: "absolute",
          right: "-5%",
          top: "-15%",
          width: "400px",
          height: "400px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
        }}
      />

      {/* Círculo médio no canto inferior esquerdo */}
      <div
        style={{
          position: "absolute",
          left: "-10%",
          bottom: "-10%",
          width: "300px",
          height: "300px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
        }}
      />

      {/* Círculo pequeno flutuante no lado direito */}
      <div
        style={{
          position: "absolute",
          right: "15%",
          top: "40%",
          width: "150px",
          height: "150px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
        }}
      />

      {/* Círculo muito pequeno no canto superior esquerdo */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: "5%",
          width: "100px",
          height: "100px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

const RTLDecorativeShapes = () => {
  return (
    <>
      {/* Semi-círculo principal - espelhado da direita para esquerda */}
      <div
        style={{
          position: "absolute",
          left: "-20%", // Mudou de right para left
          top: "50%",
          width: "800px",
          height: "800px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      />

      {/* Círculo decorativo superior - espelhado */}
      <div
        style={{
          position: "absolute",
          right: "-5%", // Mudou de left para right
          top: "-50px",
          width: "300px",
          height: "300px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />

      {/* Semicírculo decorativo inferior - espelhado */}
      <div
        style={{
          position: "absolute",
          right: "25%", // Mudou de left para right
          bottom: "-25%",
          width: "250px",
          height: "250px",
          backgroundColor: "#ffbf9e",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />
    </>
  );
};

export {
  DecorativeShapes,
  GalleryDecorativeShapes,
  RTLDecorativeShapes,
  ServicesDecorativeShapes,
};
