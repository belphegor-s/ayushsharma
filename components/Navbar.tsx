import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header id="header">
      <nav>
        <div className="logo">
          <Link href="/">
            <Image
              src="/img/logo.svg"
              width="50"
              height="50"
              alt="logo"
              quality={100}
            />
          </Link>
        </div>
        <div className="nav-links">
          <a
            href="https://github.com/belphegor-s"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
          <a href="https://gamingbox.cc" target="_blank" rel="noreferrer">
            Gaming Box
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
