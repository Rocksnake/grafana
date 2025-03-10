import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { css } from '@emotion/css';
import { GrafanaTheme2, NavModelItem } from '@grafana/data';
import { Icon, IconName, styleMixins, useTheme2 } from '@grafana/ui';
import { contextSrv } from 'app/core/services/context_srv';
import appEvents from '../../app_events';
import { ShowModalReactEvent } from '../../../types/events';
import config from '../../config';
import { OrgSwitcher } from '../OrgSwitcher';
import { getFooterLinks } from '../Footer/Footer';
import { HelpModal } from '../help/HelpModal';
import SideMenuItem from './SideMenuItem';
import { getForcedLoginUrl } from './utils';

export default function BottomSection() {
  const theme = useTheme2();
  const styles = getStyles(theme);
  const navTree: NavModelItem[] = cloneDeep(config.bootData.navTree);
  const bottomNav = navTree.filter((item) => item.hideFromMenu);
  const isSignedIn = contextSrv.isSignedIn;
  const location = useLocation();
  const forcedLoginUrl = getForcedLoginUrl(location.pathname + location.search);
  const user = contextSrv.user;
  const [showSwitcherModal, setShowSwitcherModal] = useState(false);

  const toggleSwitcherModal = () => {
    setShowSwitcherModal(!showSwitcherModal);
  };

  const onOpenShortcuts = () => {
    appEvents.publish(new ShowModalReactEvent({ component: HelpModal }));
  };

  if (user && user.orgCount > 1) {
    const profileNode = bottomNav.find((bottomNavItem) => bottomNavItem.id === 'profile');
    if (profileNode) {
      profileNode.showOrgSwitcher = true;
      profileNode.subTitle = `Current Org.: ${user?.orgName}`;
    }
  }

  return (
    <div data-testid="bottom-section-items" className={styles.container}>
      {!isSignedIn && (
        <SideMenuItem label="Sign In" target="_self" url={forcedLoginUrl}>
          <Icon name="signout" size="xl" />
        </SideMenuItem>
      )}
      {bottomNav.map((link, index) => {
        let menuItems = link.children || [];

        if (link.id === 'help') {
          menuItems = [
            ...getFooterLinks(),
            {
              text: 'Keyboard shortcuts',
              icon: 'keyboard',
              onClick: onOpenShortcuts,
            },
          ];
        }

        if (link.showOrgSwitcher) {
          menuItems = [
            ...menuItems,
            {
              text: 'Switch organization',
              icon: 'arrow-random',
              onClick: toggleSwitcherModal,
            },
          ];
        }

        return (
          <SideMenuItem
            key={`${link.url}-${index}`}
            label={link.text}
            menuItems={menuItems}
            menuSubTitle={link.subTitle}
            onClick={link.onClick}
            reverseMenuDirection
            target={link.target}
            url={link.url}
          >
            {link.icon && <Icon name={link.icon as IconName} size="xl" />}
            {link.img && <img src={link.img} alt={`${link.text} logo`} />}
          </SideMenuItem>
        );
      })}
      {showSwitcherModal && <OrgSwitcher onDismiss={toggleSwitcherModal} />}
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: none;

    @media ${styleMixins.mediaUp(`${theme.breakpoints.values.md}px`)} {
      display: block;
      margin-bottom: ${theme.spacing(2)};
    }

    .sidemenu-open--xs & {
      display: block;
    }
  `,
});
