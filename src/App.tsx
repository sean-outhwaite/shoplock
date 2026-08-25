import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent, MouseEvent } from 'react'
import './App.css'
import type {
  ShopItem,
  ShopCategory,
  ItemTier,
  PopoverPosition,
} from './types.ts'
import { formatCost, categoryAccent, getItemCardImageUrl } from './utils.tsx'
import { ItemPreviewPopover } from './components/ItemPreviewPopover.tsx'
import SearchTab from './components/SearchTab.tsx'
import ItemCard from './components/ItemCard.tsx'
import BuildDrawer from './components/BuildDrawer.tsx'
import RankWindow from './components/RankWindow.tsx'
import { useBuild } from './hooks/useBuild.ts'
import { useItemCatalog } from './hooks/useItemCatalog.ts'
import { useImagePreload } from './hooks/useImagePreload.ts'
import weaponIcon from './assets/icons/catalog_shop_tab_icon_weapon_psd.png'
import spiritIcon from './assets/icons/catalog_shop_tab_icon_spirit_psd.png'
import vitalityIcon from './assets/icons/catalog_shop_tab_icon_vitality_psd.png'
import allIcon from './assets/icons/All.svg'
import weaponBg from './assets/backgrounds/catalog_shop_bg_weapon_psd.png'
import spiritBg from './assets/backgrounds/catalog_shop_bg_spirit_psd.png'
import vitalityBg from './assets/backgrounds/catalog_shop_bg_vitality_psd.png'
import genericBg from './assets/backgrounds/catalog_shop_generic_bg_psd.png'
import loadingSpinner from './assets/Brawl_Revolver.png'
import remHelper from './assets/rem_helper.mp3'
import remHelperImg from './assets/rem_helper.png'
import voteSticker from './assets/VotedSticker_03.png'

const itemIcons: Record<ShopCategory, string> = {
  Weapon: weaponIcon,
  Spirit: spiritIcon,
  Vitality: vitalityIcon,
  All: allIcon,
}

const catalogBg: Record<ShopCategory, string> = {
  Weapon: weaponBg,
  Spirit: spiritBg,
  Vitality: vitalityBg,
  All: genericBg,
}

const displayTiers: ItemTier[] = ['TIER 1', 'TIER 2', 'TIER 3', 'TIER 4']

const categories: Array<'Weapon' | 'Spirit' | 'Vitality' | 'All'> = [
  'Weapon',
  'Vitality',
  'Spirit',
  'All',
]

const tiers: ItemTier[] = ['TIER 1', 'TIER 2', 'TIER 3', 'TIER 4', 'TIER 5']

const tierPrices: Record<ItemTier, number> = {
  'TIER 1': 800,
  'TIER 2': 1600,
  'TIER 3': 3200,
  'TIER 4': 6400,
  'TIER 5': 0,
}

const categoryOrder: Exclude<ShopCategory, 'All'>[] = [
  'Weapon',
  'Spirit',
  'Vitality',
]

const minLoadingTime = 500

function App() {
  const [selectedCategory, setSelectedCategory] =
    useState<ShopCategory>('Weapon')
  const [hoveredItem, setHoveredItem] = useState<ShopItem | null>(null)
  const [hoverUpgrades, setHoverUpgrades] = useState<string[] | null>(null)
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({
    x: 0,
    y: 0,
  })
  const shopWindowRef = useRef<HTMLElement | null>(null)
  const build = useBuild()
  const catalog = useItemCatalog()
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  const [remClicked, setRemClicked] = useState(false)
  const [windowOpen, setWindowOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), minLoadingTime)
    return () => clearTimeout(timer)
  }, [])

  const itemData = useMemo(
    () => (catalog.status === 'success' ? catalog.items : []),
    [catalog],
  )
  const itemImageUrls = useMemo(
    () => [
      ...itemData
        .filter((item) => item.tier != 'TIER 5')
        .map((item) => getItemCardImageUrl(item)),
      ...itemData.map((item) => item.imageURL),
    ],
    [itemData],
  )
  const imagesReady = useImagePreload(itemImageUrls)

  const isLoading =
    catalog.status === 'loading' || !minTimeElapsed || !imagesReady

  const itemsById = useMemo(
    () => new Map(itemData.map((item) => [item.id, item])),
    [itemData],
  )

  const groupedItems = useMemo(
    () =>
      categoryOrder.reduce<
        Record<Exclude<ShopCategory, 'All'>, Record<ItemTier, ShopItem[]>>
      >(
        (categoryAccumulator, itemCategory) => {
          categoryAccumulator[itemCategory] = tiers.reduce<
            Record<ItemTier, ShopItem[]>
          >(
            (tierAccumulator, tier) => {
              tierAccumulator[tier] = itemData.filter(
                (item) => item.category === itemCategory && item.tier === tier,
              )
              return tierAccumulator
            },
            {
              'TIER 1': [],
              'TIER 2': [],
              'TIER 3': [],
              'TIER 4': [],
              'TIER 5': [],
            },
          )

          return categoryAccumulator
        },
        {
          Weapon: {
            'TIER 1': [],
            'TIER 2': [],
            'TIER 3': [],
            'TIER 4': [],
            'TIER 5': [],
          },
          Spirit: {
            'TIER 1': [],
            'TIER 2': [],
            'TIER 3': [],
            'TIER 4': [],
            'TIER 5': [],
          },
          Vitality: {
            'TIER 1': [],
            'TIER 2': [],
            'TIER 3': [],
            'TIER 4': [],
            'TIER 5': [],
          },
        },
      ),
    [itemData],
  )

  if (isLoading)
    return (
      <div className="loading-screen">
        <img
          className="loading-spinner"
          src={loadingSpinner}
          alt="Loading..."
        />
      </div>
    )
  if (catalog.status === 'error') return <h1>Error: {catalog.error}</h1>

  function positionPopover(
    event: MouseEvent<HTMLImageElement> | FocusEvent<HTMLImageElement>,
  ) {
    const iconBounds = event.currentTarget.getBoundingClientRect()
    const gap = 14
    const margin = 18
    // Leave room for the build drawer's closed handle bar so the popover
    // never renders behind it.
    const bottomReserve = margin + 64
    const width = 400
    const maxHeight = Math.min(window.innerHeight * 0.85, 760)

    // Prefer the icon's right side; flip to the left if it wouldn't fit,
    // so the popover never covers the item it's describing.
    let x = iconBounds.right + gap
    const overflowsRight = x + width > window.innerWidth - margin
    if (overflowsRight) {
      const leftPlacement = iconBounds.left - gap - width
      x =
        leftPlacement >= margin
          ? leftPlacement
          : Math.max(margin, Math.min(window.innerWidth - width - margin, x))
    }

    let y = iconBounds.top
    if (y + maxHeight > window.innerHeight - bottomReserve) {
      y = Math.max(margin, window.innerHeight - maxHeight - bottomReserve)
    }
    if (y < margin) {
      y = margin
    }

    setPopoverPosition({ x, y })
  }

  const playAudio = () => {
    const audio = new Audio(remHelper)
    audio.play()
  }

  return (
    <div className="shop-app">
      <main className="layout">
        <section
          ref={shopWindowRef}
          className="shop-window"
          style={
            {
              '--active-accent': categoryAccent(selectedCategory),
            } as CSSProperties
          }
        >
          <nav className="tab-rail" aria-label="Shop item types">
            {categories.map((itemCategory) => (
              <button
                key={itemCategory}
                type="button"
                className={
                  selectedCategory === itemCategory
                    ? 'rail-tab active'
                    : 'rail-tab'
                }
                style={
                  {
                    '--tab-accent': categoryAccent(itemCategory),
                  } as CSSProperties
                }
                onClick={() => setSelectedCategory(itemCategory)}
              >
                <img
                  src={itemIcons[itemCategory]}
                  alt=""
                  className="rail-tab__marker"
                />
              </button>
            ))}
          </nav>

          {selectedCategory === 'All' ? (
            <div
              className="full-shop"
              style={
                {
                  backgroundImage: `url(${catalogBg.All})`,
                } as CSSProperties
              }
            >
              <header className="window-header">
                <div>
                  <h1>All items</h1>
                </div>
              </header>

              <div className="shop-body">
                <SearchTab
                  hoveredItem={hoveredItem}
                  setHoveredItem={setHoveredItem}
                  positionPopover={positionPopover}
                  itemData={itemData}
                  hoverUpgrades={hoverUpgrades}
                  setHoverUpgrades={setHoverUpgrades}
                  onAddToBuild={build.addItemToActiveSection}
                />
              </div>
            </div>
          ) : (
            <div
              className={`tier-showcase ${selectedCategory.toLowerCase()}`}
              style={
                {
                  '--category-accent': categoryAccent(selectedCategory),
                } as CSSProperties
              }
            >
              <div
                className="tier-board"
                style={
                  {
                    backgroundImage: `url(${catalogBg[selectedCategory]})`,
                  } as CSSProperties
                }
              >
                <h1 className="sr-only">{selectedCategory}</h1>
                {displayTiers.map((tier, index) => (
                  <div key={tier} className={`tier-box tier-box--${index + 1}`}>
                    <span className="tier-price">
                      §{formatCost(tierPrices[tier])}
                    </span>
                    <div
                      className={`category-grid ${selectedCategory.toLowerCase()}`}
                    >
                      {groupedItems[selectedCategory][tier].map((item) => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          hoveredItem={hoveredItem}
                          setHoveredItem={setHoveredItem}
                          positionPopover={positionPopover}
                          hoverUpgrades={hoverUpgrades}
                          setHoverUpgrades={setHoverUpgrades}
                          onAddToBuild={build.addItemToActiveSection}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hoveredItem ? (
            <ItemPreviewPopover
              item={hoveredItem}
              position={popoverPosition}
              itemData={itemData}
            />
          ) : null}
        </section>
        <img
          onClick={() => {
            playAudio()
            setRemClicked(true)
          }}
          src={remHelperImg}
          alt=""
          className={`rem-helper ${remClicked ? 'bounce-effect' : ''}`}
          onAnimationEnd={() => setRemClicked(false)}
        />

        <img
          src={voteSticker}
          alt=""
          className={`vote-sticker`}
          onClick={() => setWindowOpen(!windowOpen)}
        />
      </main>

      <RankWindow
        windowOpen={windowOpen}
        onToggleWindow={() => setWindowOpen(!windowOpen)}
      />

      <BuildDrawer
        sections={build.sections}
        activeSectionId={build.activeSectionId}
        drawerOpen={build.drawerOpen}
        itemsById={itemsById}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
        positionPopover={positionPopover}
        hoverUpgrades={hoverUpgrades}
        setHoverUpgrades={setHoverUpgrades}
        onToggleDrawer={build.toggleDrawer}
        onAddSection={build.addSection}
        onDeleteSection={build.deleteSection}
        onRenameSection={build.renameSection}
        onSetActiveSection={build.setActiveSection}
        onRemoveItem={build.removeItem}
        onMoveItem={build.moveItem}
      />
    </div>
  )
}

export default App
