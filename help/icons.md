# Selecting icons in the app
If you have to select an icon in the app, most of the time, you can just write a word and an icon will be found. If this does not yield the result you were hoping for, follow this guide to get there.

1. Open [icons8](https://icons8.com/icons/fluency) this is the source of all the icons the app uses. You can search for the thing you want on that page.
2. If you have found an icon, click it. And then click the **download** button.
3. A dialog will open, in the dialog click **Link (CDN)**. You will find a section called **#### Paste this fragment into your HTML** and below some code.   
   Occasionally there is an issue here, where below you can not see code, but again the icon you selected. In this case, select a different option and return.
4. When you see the code it will look something like this
   ```html
   <img src="https://img.icons8.com/fluency/48/null/santa.png"/>
   ```
   You can see the correct name of your icon right at the end of the code, before **.png**. In this case the correct name is *santa*.
5. Enter the name you found this way into the app to get the icon you want.

## Advanced: Using a different style

Icons8 comes with a lot of [icon styles](https://icons8.com/icons#styles) while the app uses one by default, you can use icons of any style if you wish.   
To do this, follow the steps above until you have reached the code after step *3.* and continue here:

4. The code for our favorite santa icon looks like this
   ```html
   <img src="https://img.icons8.com/arcade/64/null/santa.png"/>
   ```
   Again, the name of the icon is *santa* but since we are not using the default style, we also have to find the name of the style. You can find it at the beginning of the URL right after **icons8.com/** in this case the correct style name is *arcade*.
5. In the app enter you icon like this `<icon-name>:<style-name>` in our example we would write `santa:arcade`. This is how you can get in icon in a specific style.
