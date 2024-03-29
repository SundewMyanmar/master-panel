import React from 'react';
import {
    Container,
    Avatar,
    Typography,
    Breadcrumbs,
    Link,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    IconButton,
    Button,
    Icon,
    makeStyles,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { common } from '../config/Theme';

const styles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(1),
    },
    link: {
        display: 'flex',
    },
    cardHeader: {
        marginTop: 0,
        backgroundColor: theme.palette.primary.main,
    },
    avatar: {
        width: 35,
        height: 35,
        backgroundColor: theme.palette.secondary.main,
    },
    avatarIcon: {
        color: theme.palette.common.white,
    },
    breadCrumbIcon: {
        marginRight: theme.spacing(1),
    },
}));

export interface MasterBreadCrumb {
    name: string;
    route: string;
    icon: string;
}

export interface ActionButtons {
    name: string;
    icon: string;
    color: string;
    type: 'text' | 'icon';
    onClick: () => void;
}

export interface MasterCardProps {
    title: string;
    breadCrumbs: Array<MasterBreadCrumbs>;
    actions: Array<ActionButtons>;
    maxWidth: 'lg' | 'md' | 'sm' | 'xl' | 'xs';
    content: Any;
    icon: string;
    headerBackground: Any;
    color: Any;
}

const MasterCard = (props: MasterCardProps) => {
    const { title, breadCrumbs, actions, maxWidth, content, icon, headerBackground, color } = props;
    const classes = styles();

    let headerColor = null;
    if (headerBackground) {
        headerColor = {
            backgroundColor: headerBackground,
        };
    }
    return (
        <>
            <Container className={classes.root} component="main" maxWidth={maxWidth || 'md'}>
                <Card>
                    <CardHeader
                        className={classes.cardHeader}
                        style={headerColor}
                        avatar={
                            icon ? (
                                <Avatar aria-label="card-avatar" className={classes.avatar}>
                                    <Icon className={classes.avatarIcon}>{icon}</Icon>
                                </Avatar>
                            ) : null
                        }
                        title={
                            <>
                                <Breadcrumbs
                                    separator={
                                        <Icon fontSize="small" style={{ color: color || common.white }}>
                                            navigate_next
                                        </Icon>
                                    }
                                    aria-label="breadcrumb"
                                >
                                    <Typography variant="h6" style={{ color: color || common.gray }}>
                                        {title}
                                    </Typography>
                                    {breadCrumbs
                                        ? breadCrumbs.map((bc) => {
                                              return (
                                                  <Link
                                                      key={`bc-${bc.name}`}
                                                      href={bc.route}
                                                      style={{ color: color || common.white }}
                                                      className={classes.link}
                                                  >
                                                      {bc.icon ? (
                                                          <Icon className={classes.breadCrumbIcon} style={{ color: color || common.white }}>
                                                              {bc.icon}
                                                          </Icon>
                                                      ) : null}
                                                      {bc.name}
                                                  </Link>
                                              );
                                          })
                                        : null}
                                </Breadcrumbs>
                            </>
                        }
                        action={
                            <>
                                {actions
                                    ? actions.map((ac) => {
                                          let ico = {
                                              color: ac.color ? ac.color : color || common.white,
                                          };
                                          return (
                                              <>
                                                  {ac.type == 'icon' ? (
                                                      <IconButton
                                                          onClick={() => {
                                                              if (ac.onClick) ac.onClick();
                                                          }}
                                                          size="medium"
                                                          key={`ac-${ac.name}`}
                                                          aria-label="settings"
                                                      >
                                                          <Icon style={ico}>{ac.icon}</Icon>
                                                      </IconButton>
                                                  ) : (
                                                      <Button
                                                          onClick={() => {
                                                              if (ac.onClick) ac.onClick();
                                                          }}
                                                          style={ico}
                                                          size="medium"
                                                      >
                                                          {ac.name}
                                                      </Button>
                                                  )}
                                              </>
                                          );
                                      })
                                    : null}
                            </>
                        }
                    />
                    <CardContent>{content}</CardContent>
                </Card>
            </Container>
        </>
    );
};

export default withRouter(MasterCard);
