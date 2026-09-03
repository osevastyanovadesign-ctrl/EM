import { useEffect, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { ArrowDownRight, ArrowUpRight, Check, Instagram, Menu, Plus, X } from 'lucide-react';
import heroImage from '@assets/generated_images/elena-hero-light.png';
import tableImage from '@assets/generated_images/elena-table.png';
import partyImage from '@assets/generated_images/elena-party.png';
import elenaPortrait from '@assets/0_zOMG_YygBl8_1788353675079.jpg';

type Category = 'Все' | 'Свадьбы' | 'Бренды' | 'Детские';

type Project = {
  title: string;
  category: Exclude<Category, 'Все'>;
  place: string;
  year: string;
  image: string;
  description: string;
  large?: boolean;
};

const navItems = [
  { label: 'Подход', href: '#approach' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Как работаем', href: '#process' },
  { label: 'О Елене', href: '#about' },
  { label: 'Контакты', href: '#contact' },
];

const projects: Project[] = [
  {
    title: 'Тихий сад',
    category: 'Свадьбы',
    place: 'Подмосковье',
    year: '2025',
    image: heroImage,
    description: 'Камерная свадьба среди высоких трав, свечей и живых садовых цветов. Мы собрали пространство, в котором вечер разворачивается медленно и очень лично.',
    large: true,
  },
  {
    title: 'Forma / launch dinner',
    category: 'Бренды',
    place: 'Москва, галерея 11.12',
    year: '2025',
    image: tableImage,
    description: 'Ужин для презентации новой коллекции: графичный свет, шероховатая керамика и цвет, который продолжает характер бренда.',
  },
  {
    title: 'Ваня и космос',
    category: 'Детские',
    place: 'Москва, 12 гостей',
    year: '2024',
    image: partyImage,
    description: 'Детский праздник без готовых персонажей: маленькая экспедиция с мягкими планетами, бумажными созвездиями и большим столом для друзей.',
  },
  {
    title: 'После дождя',
    category: 'Свадьбы',
    place: 'Суздаль',
    year: '2024',
    image: tableImage,
    description: 'Тёплая история в старом доме: дождливый сад, льняной текстиль и стол, за которым хотелось задержаться до самого утра.',
  },
  {
    title: 'Пятый сезон',
    category: 'Бренды',
    place: 'Санкт-Петербург',
    year: '2024',
    image: heroImage,
    description: 'Осенний вечер для команды бренда — с редкими оттенками, тактильными материалами и светом, который менял пространство в течение ужина.',
  },
  {
    title: 'Море внутри',
    category: 'Детские',
    place: 'Москва, студия на Трёхгорке',
    year: '2025',
    image: partyImage,
    description: 'Праздник о море без буквальных декораций: спокойные оттенки, волнистые формы и много места для игры и фантазии.',
  },
];

const process = [
  ['01', 'Слушаем', 'Начинаем не с мудборда, а с разговора. Вы рассказываете, что хотите почувствовать — мы находим этому форму.'],
  ['02', 'Исследуем', 'Смотрим на пространство, свет, сезон и контекст. Собираем не референсы, а точные наблюдения.'],
  ['03', 'Собираем', 'Создаём концепцию, смету и команду. Каждый цвет, материал и жест работают на одну историю.'],
  ['04', 'Оставляем', 'В день события вы встречаете своих гостей. Мы остаёмся за кулисами — чтобы всё выглядело естественно.'],
];

function scrollToContact() {
  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
}

function projectLayout(index: number, total: number) {
  const layouts: Record<number, string[]> = {
    1: ['lg:col-span-12 lg:row-span-3'],
    2: ['lg:col-span-7 lg:row-span-3', 'lg:col-span-5 lg:row-span-3'],
    3: ['lg:col-span-7 lg:row-span-3', 'lg:col-span-5 lg:row-span-3', 'lg:col-span-12 lg:row-span-2'],
    4: ['lg:col-span-7 lg:row-span-2', 'lg:col-span-5 lg:row-span-2', 'lg:col-span-5 lg:row-span-2', 'lg:col-span-7 lg:row-span-2'],
    5: ['lg:col-span-7 lg:row-span-3', 'lg:col-span-5 lg:row-span-2', 'lg:col-span-5 lg:row-span-2', 'lg:col-span-7 lg:row-span-2', 'lg:col-span-12 lg:row-span-2'],
    6: ['lg:col-span-7 lg:row-span-2', 'lg:col-span-5 lg:row-span-2', 'lg:col-span-5 lg:row-span-2', 'lg:col-span-7 lg:row-span-2', 'lg:col-span-5 lg:row-span-2', 'lg:col-span-7 lg:row-span-2'],
  };
  const layout = layouts[total] ?? layouts[6];
  return layout[index] ?? 'lg:col-span-6 lg:row-span-2';
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<Category>('Все');
  const [sent, setSent] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectTilt, setProjectTilt] = useState<{ title: string | null; x: number; y: number }>({ title: null, x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (typeof IntersectionObserver === 'undefined') {
      revealElements.forEach((element) => element.classList.add('reveal'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealElements.forEach((element) => observer.observe(element));
    if (window.location.hash) {
      requestAnimationFrame(() => {
        document.querySelector(window.location.hash)?.scrollIntoView();
      });
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProject(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  useEffect(() => {
    const handlePointerMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType === 'touch') return;
      setCursor({ x: event.clientX, y: event.clientY, visible: true });
    };
    const hideCursor = () => setCursor((current) => ({ ...current, visible: false }));

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('blur', hideCursor);
    document.documentElement.addEventListener('mouseleave', hideCursor);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', hideCursor);
      document.documentElement.removeEventListener('mouseleave', hideCursor);
    };
  }, []);

  const visibleProjects = filter === 'Все' ? projects : projects.filter((project) => project.category === filter);

  function handleProjectPointerMove(event: ReactPointerEvent<HTMLElement>, title: string) {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    setProjectTilt({ title, x, y });
  }

  function resetProjectTilt() {
    setProjectTilt({ title: null, x: 0, y: 0 });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main className="grain overflow-hidden">
      <span className={`custom-cursor ${cursor.visible ? 'is-visible' : ''}`} style={{ left: cursor.x, top: cursor.y }} aria-hidden="true" />
      <header className="absolute left-0 right-0 top-0 z-40 text-[#24302b]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-12 md:py-7">
          <a href="#top" className="group flex items-center gap-3" data-testid="link-logo">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24302b]/45 text-[16px] italic transition-colors group-hover:border-[#6c8173] group-hover:text-[#6c8173] serif">Е</span>
            <span className="hidden text-[11px] uppercase tracking-[.16em] sm:block">Елена<br />Медведева</span>
          </a>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Основная навигация">
            {navItems.map((item) => (
                <a key={item.href} href={item.href} className="text-[11px] uppercase tracking-[.13em] text-[#24302b]/70 transition-colors hover:text-[#b18a4a]" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                {item.label}
              </a>
            ))}
          </nav>
          <button type="button" onClick={scrollToContact} className="hidden border-b border-[#b18a4a] pb-1 text-[11px] uppercase tracking-[.13em] text-[#b18a4a] transition-colors hover:text-[#24302b] hover:border-[#24302b] lg:block" data-testid="button-header-inquire">
            Обсудить событие
          </button>
          <button type="button" className="rounded-full border border-[#24302b]/45 p-2 lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} data-testid="button-mobile-menu">
            {menuOpen ? <X size={19} strokeWidth={1.5} /> : <Menu size={19} strokeWidth={1.5} />}
          </button>
        </div>
        {menuOpen && (
          <div className="absolute left-0 right-0 top-[73px] border-y border-[#24302b]/15 bg-[#d7ddd2] px-5 py-6 lg:hidden">
            <nav className="flex flex-col gap-5" aria-label="Мобильная навигация">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="text-[12px] uppercase tracking-[.16em] text-[#24302b]/85" data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                  {item.label}
                </a>
              ))}
               <button type="button" onClick={() => { setMenuOpen(false); scrollToContact(); }} className="w-fit border-b border-[#b18a4a] pb-1 text-[12px] uppercase tracking-[.16em] text-[#b18a4a]" data-testid="button-mobile-inquire">
                Обсудить событие
              </button>
            </nav>
          </div>
        )}
      </header>

      <section id="top" className="relative flex min-h-[720px] items-end bg-[#f4f0e8] text-[#24302b] md:min-h-[850px]">
        <div className="absolute inset-0 overflow-hidden">
          <img src={heroImage} alt="Светлая цветочная композиция в интерьере" className="hero-image h-full w-full object-cover" data-testid="img-hero" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,240,232,.9)_0%,rgba(244,240,232,.62)_42%,rgba(244,240,232,.08)_100%)]" />
          <div className="hero-fade-to-paper absolute inset-x-0 bottom-0 h-[36%]" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-16 pt-36 md:px-12 md:pb-24">
          <div className="max-w-[960px]">
            <p className="eyebrow mb-8 text-[#b18a4a] reveal" data-testid="text-hero-eyebrow">Студия декора событий · Москва / по всей России</p>
            <h1 className="max-w-[900px] text-[clamp(3.55rem,10vw,9.5rem)] leading-[.82] tracking-[-.06em] reveal reveal-delay-1 serif text-balance" data-testid="text-hero-title">
              События,<br /><em className="text-[#6c8173]">которые</em><br />остаются.
            </h1>
            <div className="mt-10 flex max-w-[590px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between reveal reveal-delay-2">
               <p className="max-w-[330px] text-[14px] leading-[1.55] text-[#24302b]/72" data-testid="text-hero-description">Придумываем и собираем пространства, в которых важное становится видимым. Без готовых решений. С вниманием к каждой детали.</p>
               <a href="#projects" className="gold-action group flex w-fit items-center gap-3 text-[11px] uppercase tracking-[.14em]" data-testid="link-hero-projects">
                Смотреть проекты <ArrowDownRight size={17} strokeWidth={1.2} className="gold-arrow transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
              </a>
            </div>
          </div>
          <div className="mt-20 flex justify-end pt-4 md:mt-28">
            <a href="#approach" className="gold-action group flex items-center gap-3 text-[11px] uppercase tracking-[.14em]" data-testid="link-hero-approach">
              К подходу <ArrowDownRight size={17} strokeWidth={1.2} className="gold-arrow transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
            </a>
          </div>
        </div>
      </section>

      <section id="approach" className="section-paper-to-mint px-5 py-24 md:px-12 md:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-14 md:grid-cols-[.88fr_1.12fr] md:gap-24">
          <div data-reveal>
            <p className="eyebrow mb-7 text-[#6c8173]" data-testid="text-approach-eyebrow">Подход</p>
            <h2 className="max-w-[500px] text-[clamp(3rem,6.8vw,7rem)] leading-[.86] tracking-[-.06em] text-[#24302b] serif text-balance" data-testid="text-approach-title">Не украшаем.<br /><em className="text-[#6c8173]">Создаём</em><br />ощущение.</h2>
          </div>
          <div className="grid items-end gap-10 md:grid-cols-[.8fr_1.2fr] md:gap-16" data-reveal>
            <div>
              <p className="text-[16px] leading-[1.55] text-[#24302b]/75" data-testid="text-approach-copy">Я верю, что лучший декор не перетягивает внимание на себя. Он помогает почувствовать момент: тишину перед тостом, тепло рук, воздух между двумя людьми.</p>
              <p className="mt-7 text-[16px] leading-[1.55] text-[#24302b]/75">Поэтому в каждом проекте мы ищем не идеальную картинку, а вашу интонацию.</p>
            </div>
            <div className="border-l border-[#24302b]/20 pl-6">
              <p className="gold-detail text-[clamp(3.3rem,6vw,5.5rem)] leading-none tracking-[-.07em] serif" data-testid="text-stat-events">86</p>
              <p className="mt-2 text-[11px] uppercase leading-[1.5] tracking-[.12em] text-[#24302b]/65">событий собрано<br />за 8 лет</p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-24 max-w-[1440px] border-t border-[#24302b]/20 pt-5" data-reveal>
          <div className="grid gap-9 sm:grid-cols-3">
              <div><p className="eyebrow gold-detail">Материал</p><p className="mt-3 text-[15px] text-[#24302b]/75">Ткань, которая мнётся красиво. Ветка, которая живёт своей линией.</p></div>
              <div><p className="eyebrow gold-detail">Ритм</p><p className="mt-3 text-[15px] text-[#24302b]/75">Пустота между объектами важна так же, как сам объект.</p></div>
              <div><p className="eyebrow gold-detail">Память</p><p className="mt-3 text-[15px] text-[#24302b]/75">После нас остаются фотографии. Но главное — то, что на них не попало.</p></div>
          </div>
        </div>
      </section>

      <section className="section-mint-to-paper px-5 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 md:grid-cols-[1.05fr_.95fr] md:gap-24">
            <div className="editorial-media-frame relative" data-reveal>
            <img src={tableImage} alt="Деталь сервировки с цветами и свечами" className="editorial-photo aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.03]" data-testid="img-approach-detail" />
            <p className="absolute bottom-4 left-4 bg-[#f4f0e8]/90 px-3 py-2 text-[10px] uppercase tracking-[.12em] text-[#24302b]">Наталья & Артём / Суздаль</p>
          </div>
          <div data-reveal>
            <p className="eyebrow gold-detail mb-7">Что мы делаем</p>
            <h2 className="max-w-[580px] text-[clamp(2.8rem,5vw,5.2rem)] leading-[.9] tracking-[-.06em] text-[#24302b] serif">Событие как<br /><em className="text-[#6c8173]">режиссура</em> внимания.</h2>
            <a href="#contact" className="gold-action group mt-10 flex w-fit items-center gap-3 border-b border-[#b18a4a]/60 pb-2 text-[11px] uppercase tracking-[.14em]" data-testid="link-approach-contact">
              Рассказать о своём событии <ArrowUpRight size={17} strokeWidth={1.2} className="gold-arrow transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        </div>
      </section>

      <section id="projects" className="section-paper-to-mint px-5 py-24 md:px-12 md:py-36">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end" data-reveal>
            <div>
              <p className="eyebrow mb-7 text-[#6c8173]">Избранное</p>
              <h2 className="text-[clamp(3.4rem,7vw,7.4rem)] leading-[.82] tracking-[-.07em] text-[#24302b] serif">Проекты,<br /><em className="text-[#6c8173]">которые</em><br />говорят.</h2>
            </div>
            <p className="max-w-[250px] text-[14px] leading-[1.55] text-[#24302b]/65">Каждое событие — отдельный визуальный мир. Здесь — несколько глав из нашего архива.</p>
          </div>
          <div className="mb-10 flex flex-wrap gap-x-7 gap-y-3 border-b border-[#24302b]/20 pb-4" role="tablist" aria-label="Категории проектов" data-reveal>
            {(['Все', 'Свадьбы', 'Бренды', 'Детские'] as Category[]).map((category) => (
                <button type="button" key={category} role="tab" aria-selected={filter === category} onClick={() => setFilter(category)} className={`text-[11px] uppercase tracking-[.13em] transition-colors ${filter === category ? 'text-[#6c8173]' : 'text-[#24302b]/50 hover:text-[#24302b]'}`} data-testid={`button-filter-${category.toLowerCase()}`}>
                {category}
              </button>
            ))}
          </div>
          <div id="grid-projects" className="grid auto-rows-[260px] grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[190px]" data-testid="grid-projects">
            {visibleProjects.map((project, index) => (
              <article
                key={project.title}
                className={`project-card group relative cursor-pointer overflow-hidden rounded-[14px] bg-[#24302b] outline-none focus-visible:ring-2 focus-visible:ring-[#6c8173] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4f0e8] ${projectLayout(index, visibleProjects.length)}`}
                role="button"
                tabIndex={0}
                style={{
                  transform: projectTilt.title === project.title
                    ? `perspective(1100px) rotateX(${projectTilt.y * -3}deg) rotateY(${projectTilt.x * 3}deg)`
                    : undefined,
                }}
                onClick={() => setSelectedProject(project)}
                onPointerMove={(event) => handleProjectPointerMove(event, project.title)}
                onPointerLeave={resetProjectTilt}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                data-testid={`card-project-${project.title.toLowerCase().replaceAll(' ', '-')}`}
              >
                <img src={project.image} alt={project.title} className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-95" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#24302b]/95 via-[#24302b]/10 to-transparent opacity-90" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-[#f4f0e8]">
                  <div>
                    <p className="eyebrow mb-2 text-[#d8d4c9]">{project.category} · {project.year}</p>
                    <h3 className="text-[clamp(1.7rem,3vw,2.7rem)] leading-none tracking-[-.04em] serif">{project.title}</h3>
                    <p className="mt-2 text-[12px] text-[#f4f0e8]/65">{project.place}</p>
                  </div>
                   <span className="gold-arrow flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b18a4a]/70 transition-colors group-hover:border-[#f3d48a]"><ArrowUpRight size={16} strokeWidth={1.2} /></span>
                </div>
                 <span className="gold-shimmer absolute left-5 top-5 text-[10px] uppercase tracking-[.14em] opacity-0 transition-opacity group-hover:opacity-100">Открыть проект</span>
              </article>
            ))}
          </div>
          {visibleProjects.length === 0 && <p className="py-16 text-center text-[#24302b]/60" data-testid="empty-projects">Скоро здесь появятся новые истории.</p>}
        </div>
      </section>

      <section id="process" className="section-mint px-5 py-24 text-[#24302b] md:px-12 md:py-36">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 md:grid-cols-[.7fr_1.3fr] md:gap-24" data-reveal>
            <div>
              <p className="eyebrow mb-7 text-[#6c8173]">Как работаем</p>
              <h2 className="text-[clamp(3.1rem,6vw,6.5rem)] leading-[.83] tracking-[-.07em] serif">От первого<br /><em className="text-[#6c8173]">слова</em><br />до «вау».</h2>
            </div>
            <div className="self-end">
              <p className="max-w-[430px] text-[16px] leading-[1.55] text-[#24302b]/68">Вам не нужно знать, как устроен идеальный праздник. Достаточно знать, что вы хотите в нём чувствовать.</p>
              <a href="#contact" className="gold-action group mt-8 flex w-fit items-center gap-3 border-b border-[#b18a4a]/60 pb-2 text-[11px] uppercase tracking-[.14em]" data-testid="link-process-contact">
                Обсудить ваше событие <ArrowUpRight size={17} strokeWidth={1.2} className="gold-arrow transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>
           <div className="mt-20 grid border-t border-[#24302b]/20 md:grid-cols-4" data-reveal>
            {process.map(([number, title, copy]) => (
               <div key={number} className="border-b border-[#24302b]/20 py-7 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                 <p className="eyebrow gold-detail">Шаг {number}</p>
                <h3 className="mt-10 text-[2rem] tracking-[-.04em] serif">{title}</h3>
                <p className="mt-4 max-w-[245px] text-[13px] leading-[1.6] text-[#24302b]/65">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section-mint px-5 py-24 text-[#24302b] md:px-12 md:py-36">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 md:grid-cols-[1.18fr_.82fr] md:gap-28">
          <div className="editorial-media-frame relative max-w-[480px] md:order-2 md:justify-self-end" data-reveal>
            <img src={elenaPortrait} alt="Елена Медведева, основатель студии декора событий" className="editorial-photo aspect-[3/4] w-full object-cover object-center" data-testid="img-elena-portrait" />
            <p className="absolute bottom-4 left-4 bg-[#f4f0e8]/92 px-3 py-2 text-[10px] uppercase tracking-[.12em] text-[#24302b]">Елена Медведева / основатель</p>
          </div>
          <div className="md:order-1" data-reveal>
            <p className="eyebrow mb-7 text-[#6c8173]">О Елене</p>
            <h2 className="max-w-[650px] text-[clamp(3.1rem,6.2vw,6.8rem)] leading-[.84] tracking-[-.07em] serif">Декор начинается<br />с <em className="text-[#6c8173]">внимания</em>.</h2>
            <div className="mt-10 max-w-[520px] space-y-5 text-[16px] leading-[1.55] text-[#24302b]/75">
              <p>Я Елена Медведева, основатель студии. Собираю события не ради декора как картинки, а ради состояния, которое остаётся у людей после.</p>
              <p>Мне важно услышать вашу историю, почувствовать пространство и найти точную форму для того, что словами описать не всегда получается.</p>
            </div>
            <div className="mt-12 flex flex-col gap-8 border-t border-[#24302b]/20 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="gold-detail text-[clamp(3rem,5vw,5rem)] leading-none tracking-[-.07em] serif">86</p>
                <p className="mt-2 text-[11px] uppercase leading-[1.5] tracking-[.12em] text-[#24302b]/60">событий собрано<br />за 8 лет</p>
              </div>
              <a href="#contact" className="gold-action group flex w-fit items-center gap-3 border-b border-[#b18a4a]/60 pb-2 text-[11px] uppercase tracking-[.14em]" data-testid="link-about-contact">
                Познакомиться с проектом <ArrowUpRight size={17} strokeWidth={1.2} className="gold-arrow transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-mint px-5 py-24 text-[#24302b] md:px-12 md:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-[.45fr_1.55fr] md:gap-24" data-reveal>
          <div className="flex items-start gap-3">
            <Plus size={17} strokeWidth={1.3} className="gold-arrow" />
            <p className="eyebrow">Записка Елены</p>
          </div>
          <blockquote>
            <p className="max-w-[760px] text-[clamp(2.15rem,4vw,4.8rem)] leading-[.94] tracking-[-.055em] serif">«Самые красивые события — те, где никто не старается выглядеть красиво».</p>
            <footer className="gold-action mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[.13em]"><span className="h-px w-8 bg-[#b18a4a]" /> Елена Медведева, основатель студии</footer>
          </blockquote>
        </div>
      </section>

      <section id="contact" className="section-mint-to-dark px-5 py-24 md:px-12 md:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-16 md:grid-cols-[.8fr_1.2fr] md:gap-28">
          <div data-reveal>
            <p className="eyebrow mb-7 text-[#6c8173]">Контакты</p>
            <h2 className="max-w-[560px] text-[clamp(3.3rem,7vw,7.5rem)] leading-[.82] tracking-[-.07em] text-[#24302b] serif">Давайте<br /><em className="text-[#6c8173]">придумаем</em><br />ваше.</h2>
            <div className="mt-14 border-t border-[#24302b]/20 pt-5">
              <p className="text-[13px] leading-[1.55] text-[#24302b]/65">Расскажите немного о событии — ответим в течение двух рабочих дней с первыми мыслями и вопросами.</p>
              <a href="mailto:hello@elenamedvedeva.ru" className="mt-5 inline-block text-[15px] text-[#24302b] underline decoration-[#6c8173] underline-offset-4" data-testid="link-email">hello@elenamedvedeva.ru</a>
            </div>
          </div>
          {sent ? (
            <div className="flex min-h-[440px] flex-col items-start justify-center border-y border-[#24302b]/20" data-reveal data-testid="status-form-success">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6c8173] text-[#f4f0e8]"><Check size={22} strokeWidth={1.4} /></span>
              <h3 className="mt-7 text-[clamp(2.4rem,4vw,4.5rem)] leading-none tracking-[-.05em] text-[#24302b] serif">Письмо уже<br /><em>летит к нам.</em></h3>
              <p className="mt-5 max-w-[360px] text-[14px] leading-[1.55] text-[#24302b]/65">Спасибо за доверие. Мы вернёмся с ответом и первыми идеями в течение двух рабочих дней.</p>
              <button type="button" onClick={() => setSent(false)} className="mt-8 border-b border-[#24302b]/40 pb-1 text-[11px] uppercase tracking-[.13em] text-[#24302b]" data-testid="button-send-another">Отправить ещё одну заявку</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8" data-reveal data-testid="form-contact">
              <div className="grid gap-8 sm:grid-cols-2">
                <label className="block"><span className="eyebrow mb-3 block text-[#24302b]/55">Имя</span><input required name="name" type="text" placeholder="Как к вам обращаться" className="w-full border-0 border-b border-[#24302b]/25 bg-transparent px-0 py-3 text-[16px] text-[#24302b] outline-none placeholder:text-[#24302b]/35 focus:border-[#6c8173]" data-testid="input-name" /></label>
                <label className="block"><span className="eyebrow mb-3 block text-[#24302b]/55">Контакт</span><input required name="contact" type="text" placeholder="Почта или телефон" className="w-full border-0 border-b border-[#24302b]/25 bg-transparent px-0 py-3 text-[16px] text-[#24302b] outline-none placeholder:text-[#24302b]/35 focus:border-[#6c8173]" data-testid="input-contact" /></label>
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                <label className="block"><span className="eyebrow mb-3 block text-[#24302b]/55">Формат события</span><select required name="type" defaultValue="" className="w-full border-0 border-b border-[#24302b]/25 bg-[#d7ddd2] px-0 py-3 text-[16px] text-[#24302b] outline-none focus:border-[#6c8173]" data-testid="select-event-type"><option value="" disabled>Выберите формат</option><option>Свадьба</option><option>Корпоративное событие</option><option>Детский праздник</option><option>Другое</option></select></label>
                <label className="block"><span className="eyebrow mb-3 block text-[#24302b]/55">Предпочтительная дата</span><input name="date" type="date" className="w-full border-0 border-b border-[#24302b]/25 bg-transparent px-0 py-3 text-[16px] text-[#24302b] outline-none focus:border-[#6c8173]" data-testid="input-event-date" /></label>
              </div>
              <label className="block"><span className="eyebrow mb-3 block text-[#24302b]/55">О событии</span><textarea required name="message" rows={3} placeholder="Дата, место, настроение — всё, что уже знаете" className="w-full resize-none border-0 border-b border-[#24302b]/25 bg-transparent px-0 py-3 text-[16px] text-[#24302b] outline-none placeholder:text-[#24302b]/35 focus:border-[#6c8173]" data-testid="textarea-message" /></label>
              <button type="submit" className="gold-action group flex items-center gap-3 bg-[#24302b] px-6 py-4 text-[11px] uppercase tracking-[.14em]" data-testid="button-submit-contact">Запросить дату <ArrowUpRight size={17} strokeWidth={1.2} className="gold-arrow transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button>
              <p className="max-w-[380px] text-[11px] leading-[1.5] text-[#24302b]/45">Отправляя форму, вы соглашаетесь на обработку персональных данных. Ответим в течение двух рабочих дней.</p>
            </form>
          )}
        </div>
      </section>

      <footer className="site-footer bg-[#547166] px-5 py-8 text-[#f4f0e8] md:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 border-t border-[#f4f0e8]/20 pt-6 sm:flex-row sm:items-end">
          <div><p className="text-[18px] tracking-[-.03em] serif">Елена Медведева</p><p className="mt-2 text-[10px] uppercase tracking-[.14em] text-[#f4f0e8]/50">Студия декора событий</p></div>
          <div className="flex items-center gap-7"><a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] uppercase tracking-[.13em] text-[#f4f0e8]/65 hover:text-[#b18a4a]" data-testid="link-instagram"><Instagram size={15} strokeWidth={1.3} /> Instagram</a><a href="#top" className="text-[10px] uppercase tracking-[.13em] text-[#f4f0e8]/65 hover:text-[#b18a4a]" data-testid="link-back-top">Наверх ↑</a></div>
        </div>
      </footer>

      {selectedProject && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#24302b]/75 p-4 backdrop-blur-sm md:p-10"
          role="presentation"
          onClick={() => setSelectedProject(null)}
          data-testid="project-modal-backdrop"
        >
          <div
            className="relative max-h-[calc(100vh-2rem)] w-full max-w-[1080px] overflow-auto bg-[#f4f0e8] text-[#24302b] shadow-2xl md:grid md:grid-cols-[1.05fr_.95fr] md:overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(event) => event.stopPropagation()}
            data-testid="project-modal"
          >
            <button
              type="button"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#f4f0e8]/70 bg-[#24302b]/70 text-[#f4f0e8] transition-colors hover:border-[#c8d5c6] hover:text-[#c8d5c6]"
              onClick={() => setSelectedProject(null)}
              aria-label="Закрыть проект"
              data-testid="button-close-project"
            >
              <X size={18} strokeWidth={1.2} />
            </button>
            <div className="min-h-[300px] bg-[#24302b] md:min-h-[620px]">
              <img src={selectedProject.image} alt={selectedProject.title} className="h-full min-h-[300px] w-full object-cover md:min-h-[620px]" />
            </div>
            <div className="flex flex-col justify-between p-7 md:p-12">
              <div>
                <p className="eyebrow mb-6 text-[#6c8173]">{selectedProject.category} · {selectedProject.year}</p>
                <h2 id="project-modal-title" className="max-w-[430px] text-[clamp(3rem,5vw,5.8rem)] leading-[.86] tracking-[-.06em] serif">{selectedProject.title}</h2>
                <p className="mt-8 text-[16px] leading-[1.6] text-[#24302b]/70">{selectedProject.description}</p>
              </div>
              <div className="mt-12 border-t border-[#24302b]/20 pt-5">
                <p className="eyebrow text-[#6c8173]">Локация</p>
                <p className="mt-2 text-[15px]">{selectedProject.place}</p>
                <button type="button" onClick={() => { setSelectedProject(null); scrollToContact(); }} className="gold-action group mt-10 flex w-fit items-center gap-3 border-b border-[#b18a4a]/60 pb-2 text-[11px] uppercase tracking-[.14em]">
                  Обсудить похожее событие <ArrowUpRight size={17} strokeWidth={1.2} className="gold-arrow transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;