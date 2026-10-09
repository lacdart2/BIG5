import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Locale = 'en' | 'ar'

const translations = {
  en: {
    'nav.today': 'Today',
    'nav.week': 'Week',
    'nav.live': 'Live',
    'nav.standings': 'Standings',
    'nav.favorites': 'Favorites',
    'language.switchToArabic': 'Switch to Arabic',
    'language.switchToEnglish': 'Switch to English',
    'common.all': 'All',
    'common.allCompetitions': 'All competitions',
    'common.match': 'match',
    'common.matches': 'matches',
    'common.live': 'Live',
    'common.upcoming': 'Upcoming',
    'common.showLess': 'Show less',
    'common.showMore': 'Show {count} more',
    'common.retry': 'Retry',
    'date.today': 'Today',
    'date.fixtureDate': 'Fixture date',
    'date.previousDay': 'Previous day',
    'date.nextDay': 'Next day',
    'hero.kicker': 'Five leagues. One matchday.',
    'hero.title': 'The game starts here.',
    'hero.subtitle': 'Every fixture. Every race. Your front row to European football.',
    'stats.summary': 'Matchday summary',
    'stats.brief': 'Matchday brief',
    'stats.matches': 'Matches',
    'stats.live': 'Live',
    'stats.upcoming': 'Upcoming',
    'upcoming.alsoLive': 'Also live',
    'upcoming.comingUp': 'Coming up',
    'upcoming.fullTime': 'Full-time results',
    'featured.match': 'Featured match',
    'featured.spotlightLive': 'In the spotlight',
    'featured.spotlightNext': 'Next in the spotlight',
    'featured.matchday': 'Matchday {count}',
    'featured.matchInProgress': 'Match in progress',
    'featured.kickoff': 'Kickoff',
    'featured.scoresDelayed': 'Scores may be delayed by the data provider.',
    'weekPreview.title': 'Across the week',
    'weekPreview.fullSchedule': 'Full schedule',
    'weekPreview.subtitle': 'Next seven days · Big Five + Champions League',
    'weekPreview.loading': 'Loading the week ahead…',
    'weekPreview.error': 'Week preview is unavailable until fixtures load.',
    'promo.kicker': 'From kickoff to the title race',
    'promo.title': 'Five leagues. All the feeling.',
    'promo.body': 'The weekend rivalries. The midweek drama. One place to follow it all.',
    'promo.tagline': 'Football, in focus.',
    'standingsPreview.title': 'The title race',
    'standingsPreview.full': 'Full standings',
    'install.title': 'Install BIG5',
    'install.subtitle': 'Quick access from your home screen',
    'install.action': 'Install',
    'install.dismiss': 'Dismiss',
    'footer.builtBy': 'Built by',
    'week.kicker': 'Seven days. Five leagues.',
    'week.title': 'Your football week.',
    'week.subtitle': 'Find your next kickoff. Follow every matchday.',
    'today.loading': 'Preparing your matchday…',
    'week.loading': 'Preparing your football week…',
    'week.retry': 'Retry fixtures',
    'week.emptyTitle': 'A break between matchdays.',
    'week.emptyBody': 'No fixtures for {league} on this date. Use the arrows to explore another day, or choose a different league.',
    'live.kicker': 'The matchday, unfolding',
    'live.title': 'Live football.',
    'live.subtitle': 'Every game in play. All competitions, in one place.',
    'live.checking': 'Checking matches in play…',
    'live.unavailable': 'Live matches unavailable',
    'live.delayed': 'Scores may be delayed',
    'live.loading': 'Getting the latest match scores…',
    'live.retry': 'Retry live matches',
    'live.between': 'Between the whistles',
    'live.none': 'No live matches right now.',
    'live.noneLeague': 'No {league} matches are in play. Check another competition or see the next kickoffs.',
    'live.noneAll': 'The next kickoff is worth the wait. Explore today’s fixtures or plan your football week.',
    'live.todayFixtures': 'Today’s fixtures',
    'live.viewWeek': 'View the week',
    'standings.kicker': 'The season in numbers',
    'standings.title': 'Standings',
    'standings.subtitle': 'Every point counts. Follow the race to the top.',
    'standings.previous': 'Previous league',
    'standings.next': 'Next league',
    'standings.swipe': 'Swipe header to change league',
    'standings.leagues': 'leagues',
    'favorites.title': 'Favorites',
    'favorites.subtitle': 'Saved matches',
    'favorites.emptyTitle': 'No saved matches yet.',
    'favorites.emptyBody': 'Open a match and tap the star to keep it here.',
    'favorites.remove': 'Remove from favorites',
    'matchDetails.loading': 'Loading match details…',
    'matchDetails.error': 'Could not load this match. Please try again.',
    'matchDetails.back': 'Back to matches',
    'matchDetails.save': 'Save match',
    'matchDetails.saved': 'Saved',
    'matchDetails.finished': 'Full time',
    'matchDetails.info': 'Match information',
    'matchDetails.competition': 'Competition',
    'matchDetails.venue': 'Venue',
    'matchDetails.referee': 'Referee',
    'matchDetails.attendance': 'Attendance',
    'matchDetails.notAvailable': 'Not available',
    'matchDetails.providerNote': 'Extra match information depends on what the data provider includes for this competition and plan.',
    'standings.loading': 'Loading {league} standings…',
    'standings.retry': 'Retry standings',
    'standings.empty': 'No standings available for {league}.',
    'table.clubs': '{count} clubs · Scroll horizontally for all stats →',
    'table.club': 'Club',
    'table.topFive': 'Top five',
    'table.leagueTable': 'League table',
    'table.legend': 'P Played · W Won · D Drawn · L Lost · GD Goal difference · PTS Points',
  },
  ar: {
    'nav.today': 'اليوم',
    'nav.week': 'الأسبوع',
    'nav.live': 'مباشر',
    'nav.standings': 'الترتيب',
    'nav.favorites': 'المفضلة',
    'language.switchToArabic': 'التبديل إلى العربية',
    'language.switchToEnglish': 'التبديل إلى الإنجليزية',
    'common.all': 'الكل',
    'common.allCompetitions': 'كل البطولات',
    'common.match': 'مباراة',
    'common.matches': 'مباريات',
    'common.live': 'مباشر',
    'common.upcoming': 'قادمة',
    'common.showLess': 'عرض أقل',
    'common.showMore': 'عرض {count} إضافية',
    'common.retry': 'إعادة المحاولة',
    'date.today': 'اليوم',
    'date.fixtureDate': 'تاريخ المباريات',
    'date.previousDay': 'اليوم السابق',
    'date.nextDay': 'اليوم التالي',
    'hero.kicker': 'خمس دوريات. يوم كروي واحد.',
    'hero.title': 'المباراة تبدأ هنا.',
    'hero.subtitle': 'كل مباراة. كل منافسة. مقعدك الأمامي لمتابعة كرة القدم الأوروبية.',
    'stats.summary': 'ملخص اليوم',
    'stats.brief': 'ملخص المباريات',
    'stats.matches': 'المباريات',
    'stats.live': 'مباشر',
    'stats.upcoming': 'قادمة',
    'upcoming.alsoLive': 'مباشر الآن',
    'upcoming.comingUp': 'القادم',
    'upcoming.fullTime': 'النتائج النهائية',
    'featured.match': 'المباراة المختارة',
    'featured.spotlightLive': 'تحت الأضواء',
    'featured.spotlightNext': 'القادم تحت الأضواء',
    'featured.matchday': 'الجولة {count}',
    'featured.matchInProgress': 'المباراة جارية',
    'featured.kickoff': 'موعد البداية',
    'featured.scoresDelayed': 'قد تتأخر النتائج قليلاً بسبب مزود البيانات.',
    'weekPreview.title': 'خلال الأسبوع',
    'weekPreview.fullSchedule': 'البرنامج الكامل',
    'weekPreview.subtitle': 'الأيام السبعة القادمة · الدوريات الخمسة + دوري الأبطال',
    'weekPreview.loading': 'جارٍ تحميل مباريات الأسبوع…',
    'weekPreview.error': 'تعذر عرض ملخص الأسبوع حتى يتم تحميل المباريات.',
    'promo.kicker': 'من صافرة البداية إلى سباق اللقب',
    'promo.title': 'خمس دوريات. كل الحماس.',
    'promo.body': 'منافسات نهاية الأسبوع. إثارة منتصف الأسبوع. كل شيء في مكان واحد.',
    'promo.tagline': 'كرة القدم في الواجهة.',
    'standingsPreview.title': 'سباق اللقب',
    'standingsPreview.full': 'الترتيب الكامل',
    'install.title': 'ثبّت BIG5',
    'install.subtitle': 'وصول سريع من الشاشة الرئيسية',
    'install.action': 'تثبيت',
    'install.dismiss': 'إغلاق',
    'footer.builtBy': 'تطوير',
    'week.kicker': 'سبعة أيام. خمس دوريات.',
    'week.title': 'أسبوعك الكروي.',
    'week.subtitle': 'اعرف موعد مباراتك القادمة وتابع كل جولة.',
    'today.loading': 'جارٍ تحضير يوم المباريات…',
    'week.loading': 'جارٍ تحضير مباريات الأسبوع…',
    'week.retry': 'إعادة تحميل المباريات',
    'week.emptyTitle': 'استراحة بين الجولات.',
    'week.emptyBody': 'لا توجد مباريات لـ {league} في هذا اليوم. استخدم الأسهم لاختيار يوم آخر أو بطولة مختلفة.',
    'live.kicker': 'يوم المباريات لحظة بلحظة',
    'live.title': 'كرة القدم مباشرة.',
    'live.subtitle': 'كل المباريات الجارية، وكل البطولات، في مكان واحد.',
    'live.checking': 'جارٍ التحقق من المباريات المباشرة…',
    'live.unavailable': 'المباريات المباشرة غير متاحة',
    'live.delayed': 'قد تتأخر النتائج قليلاً',
    'live.loading': 'جارٍ جلب أحدث النتائج…',
    'live.retry': 'إعادة تحميل المباريات المباشرة',
    'live.between': 'بين صافرتين',
    'live.none': 'لا توجد مباريات مباشرة الآن.',
    'live.noneLeague': 'لا توجد مباريات مباشرة لـ {league}. اختر بطولة أخرى أو اطّلع على المباريات القادمة.',
    'live.noneAll': 'لا توجد مباراة مباشرة الآن. استعرض مباريات اليوم أو خطط لأسبوعك الكروي.',
    'live.todayFixtures': 'مباريات اليوم',
    'live.viewWeek': 'عرض الأسبوع',
    'standings.kicker': 'الموسم بالأرقام',
    'standings.title': 'الترتيب',
    'standings.subtitle': 'كل نقطة مهمة. تابع سباق الصدارة.',
    'standings.previous': 'الدوري السابق',
    'standings.next': 'الدوري التالي',
    'standings.swipe': 'اسحب لتغيير الدوري',
    'standings.leagues': 'دوريات',
    'favorites.title': 'المفضلة',
    'favorites.subtitle': 'المباريات المحفوظة',
    'favorites.emptyTitle': 'لا توجد مباريات محفوظة بعد.',
    'favorites.emptyBody': 'افتح أي مباراة واضغط على النجمة لحفظها هنا.',
    'favorites.remove': 'إزالة من المفضلة',
    'matchDetails.loading': 'جارٍ تحميل تفاصيل المباراة…',
    'matchDetails.error': 'تعذر تحميل هذه المباراة. حاول مرة أخرى.',
    'matchDetails.back': 'العودة إلى المباريات',
    'matchDetails.save': 'حفظ المباراة',
    'matchDetails.saved': 'محفوظة',
    'matchDetails.finished': 'انتهت',
    'matchDetails.info': 'معلومات المباراة',
    'matchDetails.competition': 'البطولة',
    'matchDetails.venue': 'الملعب',
    'matchDetails.referee': 'الحكم',
    'matchDetails.attendance': 'الحضور',
    'matchDetails.notAvailable': 'غير متوفر',
    'matchDetails.providerNote': 'تعتمد المعلومات الإضافية على البيانات التي يوفرها مزود الخدمة لهذه البطولة والخطة.',
    'standings.loading': 'جارٍ تحميل ترتيب {league}…',
    'standings.retry': 'إعادة تحميل الترتيب',
    'standings.empty': 'لا يوجد ترتيب متاح لـ {league}.',
    'table.clubs': '{count} فريق · اسحب أفقياً لعرض كل الإحصائيات ←',
    'table.club': 'الفريق',
    'table.topFive': 'أول خمسة',
    'table.leagueTable': 'جدول الدوري',
    'table.legend': 'لعب · ف فوز · ت تعادل · خ خسارة · ف.أ فارق الأهداف · ن النقاط',
  },
} as const

const competitionArabic: Record<string, string> = {
  'Premier League': 'الدوري الإنجليزي الممتاز',
  'La Liga': 'الدوري الإسباني',
  'Primera Division': 'الدوري الإسباني',
  'Serie A': 'الدوري الإيطالي',
  'Bundesliga': 'الدوري الألماني',
  'Ligue 1': 'الدوري الفرنسي',
  'UEFA Champions League': 'دوري أبطال أوروبا',
  'Champions League': 'دوري أبطال أوروبا',
}

function detectInitialLocale(): Locale {
  const saved = localStorage.getItem('big5-locale')
  if (saved === 'ar' || saved === 'en') return saved

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (timeZone === 'Africa/Algiers') return 'ar'

  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language]
  return browserLanguages.some((language) => language.toLowerCase().startsWith('ar')) ? 'ar' : 'en'
}

interface LocaleContextValue {
  locale: Locale
  isRTL: boolean
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: keyof typeof translations.en, variables?: Record<string, string | number>) => string
  competitionName: (name: string) => string
  dateLocale: string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale === 'ar' ? 'ar' : 'en'
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('big5-locale', locale)
  }, [locale])

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    isRTL: locale === 'ar',
    setLocale: setLocaleState,
    toggleLocale: () => setLocaleState((current) => current === 'ar' ? 'en' : 'ar'),
    t: (key, variables = {}) => {
      let value: string = translations[locale][key] ?? translations.en[key] ?? key
      for (const [name, replacement] of Object.entries(variables)) {
        value = value.replace(`{${name}}`, String(replacement))
      }
      return value
    },
    competitionName: (name) => locale === 'ar' ? competitionArabic[name] ?? name : name,
    dateLocale: locale === 'ar' ? 'ar-DZ' : 'en-GB',
  }), [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside LocaleProvider')
  return context
}
