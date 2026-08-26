import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './App.css'
import type { ShopCategory } from './types.ts'
import {
  formatCost,
  categoryAccent,
  getItemCardImageUrl,
  groupItemsByCategoryAndTier,
} from './utils.tsx'
import {
  itemIcons,
  catalogBg,
  displayTiers,
  categories,
  tierPrices,
} from './shopConstants.ts'
import { ItemPreviewPopover } from './components/ItemPreviewPopover.tsx'
import SearchTab from './components/SearchTab.tsx'
import ItemCard from './components/ItemCard.tsx'
import BuildDrawer from './components/BuildDrawer.tsx'
import RankWindow from './components/RankWindow.tsx'
import { useBuild } from './hooks/useBuild.ts'
import { useItemCatalog } from './hooks/useItemCatalog.ts'
import { useImagePreload } from './hooks/useImagePreload.ts'
import { useItemPreview } from './hooks/useItemPreview.ts'
import { ItemPreviewContext } from './context/ItemPreviewContext.ts'
import loadingSpinner from './assets/Brawl_Revolver.png'
import remHelper from './assets/rem_helper.mp3'
import remHelperImg from './assets/rem_helper.png'
import voteSticker from './assets/VotedSticker_03.png'

const minLoadingTime = 500

function App() {
  const [selectedCategory, setSelectedCategory] =
    useState<ShopCategory>('Weapon')
  const itemPreview = useItemPreview()
  const { hoveredItem, popoverPosition } = itemPreview
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
    () => groupItemsByCategoryAndTier(itemData),
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

  const playAudio = () => {
    const audio = new Audio(remHelper)
    audio.play()
  }

  return (
    <ItemPreviewContext.Provider value={itemPreview}>
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
                  className={`rail-tab${itemCategory === 'All' ? ' rail-tab--all' : ''}${
                    selectedCategory === itemCategory ? ' active' : ''
                  }`}
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
              <div className="tier-showcase all">
                <div
                  className="full-shop"
                  style={
                    {
                      backgroundImage: `url(${catalogBg.All})`,
                    } as CSSProperties
                  }
                >
                  <SearchTab
                    itemData={itemData}
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
                    <div
                      key={tier}
                      className={`tier-box tier-box--${index + 1}`}
                    >
                      <span className="tier-price">
                        <span className="currency">§</span>
                        {formatCost(tierPrices[tier])}
                      </span>
                      <div
                        className={`category-grid ${selectedCategory.toLowerCase()}`}
                      >
                        {groupedItems[selectedCategory][tier].map((item) => (
                          <ItemCard
                            key={item.id}
                            item={item}
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
          onToggleDrawer={build.toggleDrawer}
          onAddSection={build.addSection}
          onDeleteSection={build.deleteSection}
          onRenameSection={build.renameSection}
          onSetActiveSection={build.setActiveSection}
          onRemoveItem={build.removeItem}
          onMoveItem={build.moveItem}
        />
      </div>
    </ItemPreviewContext.Provider>
  )
}

export default App
