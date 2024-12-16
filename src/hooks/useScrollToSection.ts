const useScrollToSection = (id: string) => {
  const scrollToSection = () => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return scrollToSection;
};

export default useScrollToSection;
