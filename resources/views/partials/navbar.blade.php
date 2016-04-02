<nav class="navbar navbar-fixed-top navbar-light navbar-main">
    <form class="navbar-search-form">
        <input class="form-control navbar-search-input" type="text" placeholder="Search">
    </form>
    <ul class="nav navbar-nav pull-right">
        <li class="nav-item dropdown notifications-menu">
            <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
                <span class="label label-primary notification-count animated zoomIn">3</span>
                <i class="fa fa-bell"></i>
            </a>

            @include('partials.notification-dropdown')

        </li>
        <img src="https://en.gravatar.com/userimage/24319273/c93bac54fc0d0105ad9bfed905aee458.jpg?size=100" class="navbar-account-image">
        <li class="nav-item dropdown account-dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
                Kunal Varma <span class="caret"></span>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="#">Profile</a>
                <a class="dropdown-item" href="#">Settings</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Log out</a>
            </div>
        </li>
    </ul>
</nav>