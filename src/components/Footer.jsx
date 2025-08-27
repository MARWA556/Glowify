function Footer() {
  return (
    <footer className="text-white py-4" style={{ backgroundColor: "var(--primary-color)" }}>
      <div className="container text-center">
        <p>&copy; {new Date().getFullYear()} SkinCare. All rights reserved.</p>
        {/* <p>Made with ❤️ by Sara Eslam</p> */}
      </div>
    </footer>
  );
}

export default Footer;
