if [ $# -lt 1 ]; then
  echo 1>&2 "        $0: <themeName>:"
  exit 2
elif [ $# -gt 1 ]; then
  echo 1>&2 "$0: too many arguments"
fi


cd KSITheme
sencha app build
tar -czf ../$1Theme.tgz \
bootstrap.js \
bootstrap.css \
bootstrap.json \
build/production \

echo "upload this to quickmit and unzip into /usr/www/users/d4dl/quickmit.net/clients/$1"

echo "if its a neptune theme you need to do this"
echo "ln -s /usr/www/users/d4dl/quickmit.net/service/ext/build/production/MyApp/neptuneApp.js prod.js"