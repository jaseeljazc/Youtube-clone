import home from "../assets/home.png";
import game_icon from "../assets/game_icon.png";
import automobiles from "../assets/automobiles.png";
import sports from "../assets/sports.png";
import entertainment from "../assets/entertainment.png";
import tech from "../assets/tech.png";
import music from "../assets/music.png";
import blogs from "../assets/blogs.png";
import news from "../assets/news.png";
import jack from "../assets/jack.png";
import simon from "../assets/simon.png";
import tom from "../assets/tom.png";
import megan from "../assets/megan.png";
import cameron from "../assets/cameron.png";

const Sidebar = ({ sidebar, category, setCategory}) => {
  const categories = [
    { id: "20", img: game_icon, label: "Gaming" },
    { id: "2", img: automobiles, label: "Autos & Vehicles" },
    { id: "17", img: sports, label: "Sports" },
    { id: "24", img: entertainment, label: "Entertainment" },
    { id: "28", img: tech, label: "Science & Technology" },
    { id: "10", img: music, label: "Music" },
    { id: "22", img: blogs, label: "People & Blogs" },
    { id: "25", img: news, label: "News & Politics" },
    { id: "1", img: game_icon, label: "Film & Animation" },
    { id: "15", img: automobiles, label: "Pets & Animals" },
    { id: "19", img: sports, label: "Travel & Events" },
    { id: "23", img: entertainment, label: "Comedy" },
    { id: "26", img: tech, label: "Howto & Style" },
    { id: "27", img: music, label: "Education" },
  ];

  const subscriptions = [
    { img: simon, label: "Simon" },
    { img: jack, label: "Jack" },
    { img: tom, label: "Tom" },
    { img: megan, label: "Megan" },
    { img: cameron, label: "Cameron" },
  ];

  const MenuItem = ({ img, label, id }) => (
    <div
      onClick={() => setCategory(id || 0)}
      className={`flex items-center px-0 sm:px-2 py-2 hover:bg-gray-900/40 hover:text-white rounded-lg cursor-pointer transition-colors duration-200 ${
        category === id ? "bg-gray-100" : ""
      }`}
    >
      <img src={img} alt={label} className="w-6 h-6 flex-shrink-0" />
      <span
        className={`ml-4 text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${
          sidebar ? "opacity-100" : "opacity-0"
        }`}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div
      className={`${
        sidebar ? "sm:w-55" : "w-0 sm:w-20"
      } bg-white/70 sm:block custom-scrollbar sm:bg-white h-screen overflow-y-scroll scrollbar-hide  border-r border-gray-200 fixed left-0 top-16 z-40 transition-[width] duration-300 ease-in-out`}
    >
      <div className="py-2">
        {/* Home */}
        <div className="px-3 py-2">
          <MenuItem img={home} label="Home" id="0" />
        </div>

        {/* Categories */}
        <div className="px-3 py-2">
          {categories.map((item, index) => (
            <MenuItem key={index} img={item.img} label={item.label} id={item.id} />
          ))}
        </div>

        {/* Subscriptions */}
        <div className="px-3 py-2">
          <h3
            className={`px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider py-2 transition-opacity duration-300 ${
              sidebar ? "opacity-100" : "opacity-0"
            }`}
          >
            Subscriptions
          </h3>
          {subscriptions.map((item, index) => (
            <MenuItem key={index} img={item.img} label={item.label} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;