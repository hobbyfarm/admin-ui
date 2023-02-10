PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[", ]//g')

echo "Building HobbyFarm Amdin UI $PACKAGE_VERSION"

ng build --prod --aot

docker build -t "hobbyfarm/admin-ui" .

docker tag "hobbyfarm/admin-ui" "hobbyfarm/admin-ui:$PACKAGE_VERSION"

docker push "hobbyfarm/admin-ui:$PACKAGE_VERSION"

echo "HobbyFarm Admin UI built. Pushed version $PACKAGE_VERSION to Docker hub"
