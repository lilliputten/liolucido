#!/bin/sh
# vim: ft=sh
# @desc Config variables (common version -- stored in repository)
# @changed 2025.08.01, 22:20

if [ -z "$CONFIG_IMPORTED" ]; then

  IS_WINDOWS=`echo "${OS}" | grep -i "windows"`
  IS_CYGWIN=`uname | grep -i "CYGWIN"`

  # NOTE: Chec if git remote has been added
  APP_ID=`git ls-remote --get-url | xargs basename -s .git`

  VERSION_FILE="project-version.txt"
  PROJECT_INFO_FILE="public/app-info.txt"
  PROJECT_INFO_JSON_FILE="src/app-info.json"

  SRC_TAG_PREFIX="v" # "v" for default "v.X.Y.Z"

  # Timezone for timestamps (GMT, Europe/Moscow, Asia/Bangkok, Asia/Tashkent, etc)
  TIMEZONE="Europe/Moscow"

  # PYTHON_RUNTIME="python" # See `check-python-env.sh`

  # TODO: To use generic `init-crossplatform-command-names.sh`?
  FINDCMD="find"
  SORTCMD="sort"
  GREPCMD="grep"
  RMCMD="rm"
  DATECMD="date"
  # # Override posix commands for cygwin or/and windows (may be overrided in `config-local.sh`, see `config-local.sh.TEMPLATE`)...
  if [ "$IS_CYGWIN" ]; then
      # Don't use windows' native commands if there are cygwin's ones
      which "/usr/bin/find" > /dev/null 2>&1 && FINDCMD="/usr/bin/find"
      which "/usr/bin/sort" > /dev/null 2>&1 && SORTCMD="/usr/bin/sort"
      which "/usr/bin/grep" > /dev/null 2>&1 && GREPCMD="/usr/bin/grep"
      which "/usr/bin/rm" > /dev/null 2>&1 && RMCMD="/usr/bin/rm"
      which "/usr/bin/date" > /dev/null 2>&1 && DATECMD="/usr/bin/date"
  fi

  scriptsPath=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")
  test -f "$scriptsPath/config-local.sh" && . "$scriptsPath/config-local.sh"

  CONFIG_IMPORTED=1

fi
