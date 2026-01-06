const Footer = () => {

  const year = new Date().getFullYear();

  return (
    <footer className="bg-muted p-7">
      <div className="p-4 text-center text-foreground">
        &copy; {year} Apartus.
      </div>
      <p className="text-center text-muted-foreground">
        Todos os direitos reservados.
      </p>
    </footer>
  );
};

export default Footer;
