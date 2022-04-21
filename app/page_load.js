// eslint-disable-next-line no-unused-vars
function openTab(evt, tabName) {
  const event = evt;

  if (tabName === 'Home') {
    document.getElementById('selected').style.marginLeft = '0px';
  }

  if (tabName === 'Profile') {
    document.getElementById('selected').style.marginLeft = '120px';
  }

  if (tabName === 'Configurations') {
    document.getElementById('selected').style.marginLeft = '278px';
  }

  if (tabName === 'Miscellaneous') {
    document.getElementById('selected').style.marginLeft = '473px';
  }

  // Get all elements with class="tabcontent" and hide them
  const tabContent = document.getElementsByClassName('tabcontent');
  const tabContentArr = Object.getOwnPropertyNames(tabContent);
  tabContentArr.forEach((_, i) => {
    if (!tabContent[i]) return;

    tabContent[i].style.display = 'none';
  });

  // Get all elements with class="tablinks" and remove the class "active"
  const tabLinks = document.getElementsByClassName('tablinks');
  const tabLinkArr = Object.getOwnPropertyNames(tabLinks);
  tabLinkArr.forEach((_, i) => {
    if (!tabLinks[i]) return;

    tabLinks[i].className = tabLinks[i].className.replace(' active', '');
  });

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = 'block';
  event.currentTarget.className += ' active';
}
