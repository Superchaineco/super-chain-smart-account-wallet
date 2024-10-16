import { useCallback, useState, type ReactElement } from 'react'
import { Box, Divider, Drawer } from '@mui/material'
import SidebarHeader from '@/components/sidebar/SidebarHeader'
import SidebarNavigation from '@/components/sidebar/SidebarNavigation'
import SidebarFooter from '@/components/sidebar/SidebarFooter'

import css from './styles.module.css'
import { trackEvent, OVERVIEW_EVENTS } from '@/services/analytics'
import MyAccounts from '@/components/welcome/MyAccounts'

const Sidebar = (): ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  const onDrawerToggle = useCallback(() => {
    setIsDrawerOpen((isOpen) => {
      trackEvent({ ...OVERVIEW_EVENTS.SIDEBAR, label: isOpen ? 'Close' : 'Open' })

      return !isOpen
    })
  }, [])

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  return (
    <div data-testid="sidebar-container" className={css.container}>
      <div className={css.scroll}>
        {/* <ChainIndicator showLogo={false} /> */}

        {/* Open the safes list */}
        {/* <button data-testid="open-safes-icon" className={css.drawerButton} onClick={onDrawerToggle}>
          <ChevronRight />
        </button> */}

        <SidebarHeader />

        <Divider />

        {/* Nav menu */}
        <SidebarNavigation />

        <Box flex={1} />

        <SidebarFooter />
      </div>

      <Drawer variant="temporary" anchor="left" open={isDrawerOpen} onClose={onDrawerToggle}>
        <div className={css.drawer}>
          <MyAccounts onLinkClick={closeDrawer}></MyAccounts>
        </div>
      </Drawer>
    </div>
  )
}

export default Sidebar
