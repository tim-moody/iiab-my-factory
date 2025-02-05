# starts hotspot using network manager
# port 80 automatically opened?
# automatically run dnsmasq (it cannot already be running)
# https://variwiki.com/index.php?title=Wifi_NetworkManager

HOTSPOT=TestHotSpot

rfkill unblock wifi
nmcli radio wifi on
nmcli connection add type wifi ifname wlan0 con-name test-hot-spot autoconnect yes ssid $HOTSPOT
nmcli connection modify test-hot-spot 802-11-wireless.mode ap 802-11-wireless.band bg ipv4.method shared
nmcli connection up test-hot-spot

# nmcli connection down test-hot-spot
# nmcli connection delete test-hot-spot

# nmcli dev wifi hotspot
# will generate a password and start a hotspot with SSID Hotspot-<YOUR_HOSTNAME> on the default wifi interface.

# To show the Wi-Fi name and password (and a QR code):

# nmcli dev wifi show-password
# nmcli dev wifi --help shows parameters, but some have prefix like 802-11-wireless.ssid, wifi-sec.key-mgmt
